import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Award,
  Calendar,
  BarChart3,
  Home,
  AlertCircle,
  Loader2,
  Trophy,
  Star,
  Clock,
  User,
  FileText,
} from "lucide-react";

const SubmissionDetails = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await axios.get(`/api/submission/${id}`);
      setSubmission(response.data.submission);
    } catch (error) {
      setError("Failed to load submission details");
      console.error("Error fetching submission:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-300">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-red-400 mb-2">
            Submission Not Available
          </h3>
          <p className="text-gray-400 mb-4">
            {error || "Submission not found"}
          </p>
          <Link
            to="/submissions"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Submissions
          </Link>
        </div>
      </div>
    );
  }

  // Determine performance level
  const getPerformanceLevel = (score) => {
    if (score >= 90)
      return {
        level: "Excellent",
        color: "text-green-400",
        icon: <Trophy className="h-5 w-5" />,
      };
    if (score >= 70)
      return {
        level: "Good",
        color: "text-blue-400",
        icon: <Award className="h-5 w-5" />,
      };
    if (score >= 50)
      return {
        level: "Average",
        color: "text-yellow-400",
        icon: <Star className="h-5 w-5" />,
      };
    return {
      level: "Needs Improvement",
      color: "text-red-400",
      icon: <AlertCircle className="h-5 w-5" />,
    };
  };

  const performance = getPerformanceLevel(submission.score);

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/submissions"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Submissions
        </Link>

        {/* Header Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-400" />
                Submission Details
              </h1>
              <h2 className="text-xl text-blue-400 font-semibold">
                {submission.quiz.title}
              </h2>
              <div className="flex items-center text-gray-400 mt-3">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  Submitted on{" "}
                  {new Date(submission.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center">
              <div className="text-center bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {performance.icon}
                  <span className={`ml-2 font-medium ${performance.color}`}>
                    {performance.level}
                  </span>
                </div>
                <div className={`text-3xl font-bold ${performance.color}`}>
                  {submission.score}%
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  {submission.correctAnswers} of {submission.totalQuestions}{" "}
                  correct
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="bg-blue-900 p-2 rounded-full mr-3">
                <CheckCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Correct Answers</p>
                <p className="text-white font-semibold text-xl">
                  {submission.correctAnswers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="bg-red-900 p-2 rounded-full mr-3">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Incorrect Answers</p>
                <p className="text-white font-semibold text-xl">
                  {submission.totalQuestions - submission.correctAnswers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="bg-purple-900 p-2 rounded-full mr-3">
                <BarChart3 className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-white font-semibold text-xl">
                  {submission.score}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Details */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-400" />
            Question Breakdown
          </h3>

          <div className="space-y-4">
            {submission.detailedResults.map((result, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
              >
                <div
                  className={`flex items-center px-4 py-3 ${result.isCorrect ? "bg-green-900 bg-opacity-20" : "bg-red-900 bg-opacity-20"}`}
                >
                  {result.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400 mr-2" />
                  )}
                  <span
                    className={`font-medium ${result.isCorrect ? "text-green-400" : "text-red-400"}`}
                  >
                    Question {index + 1}:{" "}
                    {result.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-white font-medium mb-4">
                    {result.questionText}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-2 flex items-center">
                        <span className="bg-gray-700 rounded-full p-1 mr-2">
                          <User className="h-3 w-3" />
                        </span>
                        Your Answer
                      </p>
                      <div
                        className={`p-3 rounded-lg ${result.isCorrect ? "bg-green-900 bg-opacity-30 text-green-300" : "bg-red-900 bg-opacity-30 text-red-300"}`}
                      >
                        {result.userAnswer || "Not answered"}
                      </div>
                    </div>

                    {!result.isCorrect && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2 flex items-center">
                          <span className="bg-gray-700 rounded-full p-1 mr-2">
                            <CheckCircle className="h-3 w-3" />
                          </span>
                          Correct Answer
                        </p>
                        <div className="p-3 rounded-lg bg-green-900 bg-opacity-30 text-green-300">
                          {result.correctAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/submissions"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Submissions
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;
