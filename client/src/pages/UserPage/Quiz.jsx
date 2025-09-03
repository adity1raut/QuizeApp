import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  Loader2,
  Send,
  BarChart3,
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

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`/api/quiz/${id}/start`);
      setQuiz(response.data.quiz);
    } catch (error) {
      setError("Failed to load quiz");
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

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
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-300">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-400 text-xl">
            {error || "Quiz not found"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>

          <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
          <p className="text-gray-400">{quiz.description}</p>

          <div className="flex items-center mt-4 text-gray-400 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{quiz.questions.length} questions</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-300">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800 shadow-lg rounded-xl p-6 mb-8 border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-6 flex">
            <span className="bg-blue-700 h-8 w-8 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
              {currentQuestion + 1}
            </span>
            {question.questionText}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                  answers[question._id] === option
                    ? "bg-blue-900 border-blue-500"
                    : "bg-gray-700 hover:bg-gray-600 border-gray-600"
                }`}
                onClick={() => handleAnswerSelect(question._id, option)}
              >
                {answers[question._id] === option ? (
                  <CheckCircle className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
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
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center px-4 py-3 rounded-md font-medium transition-colors ${
              currentQuestion === 0
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                Object.keys(answers).length < quiz.questions.length
              }
              className={`flex items-center px-4 py-3 rounded-md font-medium transition-colors ${
                submitting ||
                Object.keys(answers).length < quiz.questions.length
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Quiz
                </>
              )}
            </button>
          )}
        </div>

        {/* Answer status */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-300">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span>
                Answered: {Object.keys(answers).length} of{" "}
                {quiz.questions.length} questions
              </span>
            </div>

            <div className="flex space-x-1">
              {quiz.questions.map((q, index) => (
                <div
                  key={q._id}
                  className={`h-2 w-2 rounded-full ${
                    answers[q._id]
                      ? "bg-green-400"
                      : index === currentQuestion
                        ? "bg-blue-400"
                        : "bg-gray-600"
                  }`}
                  title={
                    index === currentQuestion
                      ? "Current question"
                      : answers[q._id]
                        ? "Answered"
                        : "Not answered"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
