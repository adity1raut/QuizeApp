import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  Send,
  BarChart3,
  Brain,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Activity
} from "lucide-react";

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
      setTimeRemaining(prev => {
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

  // Format time for display (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg border border-red-800/50 p-8 max-w-md text-center">
          <div className="text-red-400 mb-4">
            <Activity size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading Quiz</h3>
          <p className="text-gray-400 mb-4">{error || "Quiz not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Quizzes
          </button>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <Brain className="h-8 w-8 mr-3 text-blue-400" />
                  {quiz.title}
                </h1>
                <p className="text-gray-400">{quiz.description}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center text-gray-300 bg-gray-700/50 px-3 py-2 rounded-lg">
                  <Clock className="h-5 w-5 mr-2 text-blue-400" />
                  <span>{quiz.questions.length} questions</span>
                </div>
                
                {timeRemaining !== null && (
                  <div className={`flex items-center px-3 py-2 rounded-lg ${
                    timeRemaining < 60 ? 'bg-red-900/30 text-red-300' : 'bg-blue-900/30 text-blue-300'
                  }`}>
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-mono">{formatTime(timeRemaining)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8 shadow-sm">
          <div className="flex justify-between mb-4">
            <span className="text-sm font-medium text-gray-300">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-300">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Question navigation dots */}
          <div className="flex justify-center space-x-2">
            {quiz.questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => handleQuestionNav(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  answers[q._id]
                    ? "bg-green-400"
                    : index === currentQuestion
                      ? "bg-blue-400"
                      : "bg-gray-600 hover:bg-gray-500"
                }`}
                title={`Question ${index + 1}: ${answers[q._id] ? 'Answered' : 'Unanswered'}`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8 shadow-sm">
          <div className="flex items-start mb-6">
            <span className="bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
              {currentQuestion + 1}
            </span>
            <h3 className="text-xl font-medium text-white pt-1.5">
              {question.questionText}
            </h3>
          </div>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-start p-4 rounded-lg cursor-pointer transition-all border ${
                  answers[question._id] === option
                    ? "bg-blue-900/30 border-blue-700/50"
                    : "bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 hover:border-gray-500"
                }`}
                onClick={() => handleAnswerSelect(question._id, option)}
              >
                {answers[question._id] === option ? (
                  <CheckCircle className="h-6 w-6 text-blue-400 mr-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-400 mr-4 mt-0.5 flex-shrink-0" />
                )}
                <label
                  htmlFor={`option-${index}`}
                  className="block text-gray-100 cursor-pointer select-none"
                >
                  {option}
                </label>
                <input
                  id={`option-${index}`}
                  name="answer"
                  type="radio"
                  className="hidden"
                  checked={answers[question._id] === option}
                  onChange={() => handleAnswerSelect(question._id, option)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center px-5 py-3 rounded-lg font-medium transition-all ${
              currentQuestion === 0
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </button>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                answeredCount < quiz.questions.length
              }
              className={`flex items-center px-5 py-3 rounded-lg font-medium transition-all ${
                submitting || answeredCount < quiz.questions.length
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Quiz
                </>
              )}
            </button>
          )}
        </div>

        {/* Answer status */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center text-gray-300 mb-3 sm:mb-0">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              <span>
                <span className="font-semibold text-white">{answeredCount}</span> of{" "}
                <span className="font-semibold text-white">{quiz.questions.length}</span> questions answered
              </span>
            </div>

            <div className="flex items-center">
              <div className="flex mr-3 text-sm text-gray-400">
                <div className="flex items-center mr-3">
                  <div className="h-3 w-3 rounded-full bg-green-400 mr-1"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-gray-600 mr-1"></div>
                  <span>Unanswered</span>
                </div>
              </div>
              
              {answeredCount === quiz.questions.length && (
                <div className="bg-green-900/30 text-green-300 px-3 py-1.5 rounded-lg flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  All questions answered
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;