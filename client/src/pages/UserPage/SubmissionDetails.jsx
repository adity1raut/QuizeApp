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
  Trophy,
  Star,
  Clock,
  User,
  FileText,
  Activity
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg border border-red-800/50 p-8 max-w-md text-center">
          <div className="text-red-400 mb-4">
            <Activity size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading Submission</h3>
          <p className="text-gray-400 mb-4">{error || "Submission not found"}</p>
          <Link
            to="/submissions"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          
          <h1 className="text-3xl font-bold text-white flex items-center">
            <FileText className="h-8 w-8 mr-3 text-blue-400" />
            Submission Details
          </h1>
          <p className="text-gray-400 mt-2">
            Review your quiz performance and question breakdown
          </p>
        </div>

        {/* Header Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl text-blue-400 font-semibold">
                {submission.quiz.title}
              </h2>
              <div className="flex items-center text-gray-400 mt-3">
                <Calendar size={16} className="mr-2 text-gray-500" />
                <span>
                  Submitted on {new Date(submission.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
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
                  {submission.correctAnswers} of {submission.totalQuestions} correct
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-700/30 mr-4">
                <CheckCircle className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Correct Answers</p>
                <p className="text-white font-semibold text-2xl">
                  {submission.correctAnswers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30 mr-4">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Incorrect Answers</p>
                <p className="text-white font-semibold text-2xl">
                  {submission.totalQuestions - submission.correctAnswers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-700/30 mr-4">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-white font-semibold text-2xl">
                  {submission.score}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Details */}
        <div className="mb-8">
          <div className="px-6 py-4 border-b border-gray-700 mb-6">
            <div className="flex items-center">
              <Clock className="text-gray-400 mr-3" size={24} />
              <h2 className="text-xl font-semibold text-white">Question Breakdown</h2>
            </div>
          </div>

          <div className="space-y-6">
            {submission.detailedResults.map((result, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm"
              >
                <div
                  className={`px-6 py-4 ${result.isCorrect ? "bg-green-900/20 border-b border-green-700/30" : "bg-red-900/20 border-b border-red-700/30"}`}
                >
                  <div className="flex items-center">
                    {result.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 mr-2" />
                    )}
                    <span
                      className={`font-medium ${result.isCorrect ? "text-green-400" : "text-red-400"}`}
                    >
                      Question {index + 1}: {result.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-white font-medium mb-4 text-lg">
                    {result.questionText}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-400 text-sm mb-2 flex items-center">
                        <span className="bg-gray-700 rounded-full p-1 mr-2">
                          <User className="h-3 w-3" />
                        </span>
                        Your Answer
                      </p>
                      <div
                        className={`p-4 rounded-lg ${result.isCorrect ? "bg-green-900/30 text-green-300 border border-green-700/30" : "bg-red-900/30 text-red-300 border border-red-700/30"}`}
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
                        <div className="p-4 rounded-lg bg-green-900/30 text-green-300 border border-green-700/30">
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
      </div>
    </div>
  );
};

export default SubmissionDetails;