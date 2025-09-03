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
  Brain,
  Trophy,
  HelpCircle,
  ChevronRight,
  ChevronLeft
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-14 w-14 text-blue-500 animate-spin mx-auto" />
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
          </div>
          <p className="mt-4 text-gray-300 text-lg">Loading your quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700">
          <div className="relative mb-4">
            <AlertCircle className="h-14 w-14 text-red-400 mx-auto" />
            <div className="absolute -inset-2 bg-red-500/10 rounded-full animate-pulse"></div>
          </div>
          <p className="mt-4 text-red-300 text-xl mb-6">
            {error || "Quiz not found"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/20"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-8 px-4">
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

          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <Brain className="h-8 w-8 text-blue-400 mr-3" />
                  {quiz.title}
                </h1>
                <p className="text-gray-400 text-lg">{quiz.description}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center text-gray-300 bg-gray-700/50 px-3 py-2 rounded-lg">
                  <Clock className="h-5 w-5 mr-2 text-blue-400" />
                  <span>{quiz.questions.length} questions</span>
                </div>
                
                {timeRemaining !== null && (
                  <div className={`flex items-center px-3 py-2 rounded-lg ${
                    timeRemaining < 60 ? 'bg-red-900/30 text-red-300 animate-pulse' : 'bg-purple-900/30 text-purple-300'
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
        <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 shadow">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-300">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Question navigation dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {quiz.questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => handleQuestionNav(index)}
                className={`h-3 w-3 rounded-full transition-all ${
                  answers[q._id]
                    ? "bg-green-400"
                    : index === currentQuestion
                      ? "bg-blue-400 ring-2 ring-blue-500 ring-opacity-50"
                      : "bg-gray-600 hover:bg-gray-500"
                }`}
                title={`Question ${index + 1}: ${answers[q._id] ? 'Answered' : 'Unanswered'}`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-8 border border-gray-700 transition-all">
          <div className="flex items-start mb-6">
            <span className="bg-gradient-to-br from-blue-500 to-indigo-500 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0 shadow-md">
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
                className={`flex items-start p-4 rounded-xl cursor-pointer transition-all border ${
                  answers[question._id] === option
                    ? "bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-700/50 shadow-md"
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
                  className="block text-gray-100 cursor-pointer select-none text-lg"
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
                : "bg-gray-700 text-gray-200 hover:bg-gray-600 shadow-md"
            }`}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </button>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/20"
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
                  : "bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-green-500/20"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
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
        <div className="p-5 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center text-gray-300 mb-3 sm:mb-0">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              <span className="text-lg">
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