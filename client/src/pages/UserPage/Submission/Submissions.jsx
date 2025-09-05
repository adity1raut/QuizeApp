import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  AlertCircle,
  BookOpen,
  BarChart3,
  Calendar,
  ChevronRight,
  Home,
  Loader2,
  Trophy,
  Clock,
  FileText,
  User,
  Activity,
} from "lucide-react";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get("/api/my-submissions");
      setSubmissions(response.data.submissions);
    } catch (error) {
      setError("Failed to fetch submissions");
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return "bg-green-900/30";
    if (score >= 70) return "bg-blue-900/30";
    if (score >= 50) return "bg-yellow-900/30";
    return "bg-red-900/30";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg border border-red-800/50 p-8 max-w-md text-center">
          <div className="text-red-400 mb-4">
            <Activity size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Error Loading Submissions
          </h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchSubmissions}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <FileText className="h-8 w-8 mr-3 text-blue-400" />
              My Quiz Submissions
            </h1>
            <p className="text-gray-400 mt-2">
              Review your quiz attempts and performance history
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-750 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm p-12 text-center">
            <BookOpen size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No Submissions Yet
            </h3>
            <p className="text-gray-400 mb-6">
              You haven't submitted any quizzes yet. Take your first quiz to see
              your results here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Take a Quiz
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center">
                <BarChart3 className="text-gray-400 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-white">
                  {submissions.length}{" "}
                  {submissions.length === 1 ? "Submission" : "Submissions"}
                </h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Quiz Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      Time
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {submissions.map((submission) => (
                    <tr key={submission._id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {submission.quiz.title}
                        </div>
                        <div className="text-sm text-gray-400 mt-1 md:hidden">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreBgColor(submission.score)} ${getScoreColor(submission.score)}`}
                        >
                          {submission.score}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-300 flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-500" />
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-gray-300 flex items-center">
                          <Clock size={16} className="mr-2 text-gray-500" />
                          {new Date(submission.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/submission/${submission._id}`}
                          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          View
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Submissions;
