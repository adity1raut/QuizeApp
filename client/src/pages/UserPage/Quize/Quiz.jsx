import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import QuizHeader from "./QuizHeader";
import QuizProgress from "./QuizProgress";
import QuestionCard from "./QuestionCard";
import QuizNavigation from "./QuizNavigation";
import AnswerStatus from "./AnswerStatus";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`/api/quiz/${id}/start`);
      setQuiz(response.data.quiz);

      // If quiz has a time limit, set up timer
      if (response.data.quiz.timeLimit) {
        setTimeRemaining(response.data.quiz.timeLimit * 60); // Convert minutes to seconds
      }
    } catch (error) {
      setError("Failed to load quiz");
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  // Timer effect for quizzes with time limits
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time runs out
          if (Object.keys(answers).length > 0) {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, answers]);

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers({
      ...answers,
      [questionId]: selectedAnswer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionNav = (index) => {
    setCurrentQuestion(index);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Format answers for submission
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        }),
      );

      const response = await axios.post(`/api/quiz/${id}/submit`, {
        answers: formattedAnswers,
      });

      navigate(`/results/${response.data.results.submissionId}`);
    } catch (error) {
      if (error.response?.data?.previousScore) {
        alert(
          `You've already submitted this quiz. Your previous score was ${error.response.data.previousScore}%`,
        );
        navigate("/");
      } else {
        setError("Failed to submit quiz");
        console.error("Error submitting quiz:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your quiz..." />;
  }

  if (error || !quiz) {
    return (
      <ErrorMessage
        error={error || "Quiz not found"}
        onReturnHome={() => navigate("/")}
      />
    );
  }

  const question = quiz.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <QuizHeader
          quiz={quiz}
          timeRemaining={timeRemaining}
          onBack={() => navigate(-1)}
        />

        <QuizProgress
          currentQuestion={currentQuestion}
          totalQuestions={quiz.questions.length}
          answers={answers}
          onQuestionNav={handleQuestionNav}
        />

        <QuestionCard
          question={question}
          questionNumber={currentQuestion + 1}
          selectedAnswer={answers[question._id]}
          onAnswerSelect={handleAnswerSelect}
        />

        <QuizNavigation
          currentQuestion={currentQuestion}
          totalQuestions={quiz.questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          submitting={submitting}
          answeredCount={answeredCount}
        />

        <AnswerStatus
          answeredCount={answeredCount}
          totalQuestions={quiz.questions.length}
        />
      </div>
    </div>
  );
};

export default Quiz;
