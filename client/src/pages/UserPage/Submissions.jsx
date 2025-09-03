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
    if (score >= 90) return "bg-green-900 bg-opacity-30";
    if (score >= 70) return "bg-blue-900 bg-opacity-30";
    if (score >= 50) return "bg-yellow-900 bg-opacity-30";
    return "bg-red-900 bg-opacity-30";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-300">Loading your submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <FileText className="h-8 w-8 mr-3 text-blue-400" />
            My Quiz Submissions
          </h1>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Link>
        </div>

        {error && (
          <div className="bg-red-900 bg-opacity-20 p-4 rounded-lg border border-red-800 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div className="text-red-300">{error}</div>
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gray-700 rounded-full">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No Submissions Yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
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
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-400 mr-2" />
                <h2 className="text-lg font-medium text-white">
                  {submissions.length}{" "}
                  {submissions.length === 1 ? "Submission" : "Submissions"}
                </h2>
              </div>
            </div>
            <ul className="divide-y divide-gray-700">
              {submissions.map((submission) => (
                <li key={submission._id}>
                  <Link
                    to={`/submission/${submission._id}`}
                    className="block hover:bg-gray-750 transition-colors"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${getScoreBgColor(submission.score)}`}
                            >
                              <span
                                className={`text-sm font-bold ${getScoreColor(submission.score)}`}
                              >
                                {submission.score}%
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-white">
                              {submission.quiz.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                              {submission.quiz.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-3 hidden sm:block">
                            <div className="flex items-center text-sm text-gray-400">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(
                                  submission.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {new Date(
                                  submission.createdAt,
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Submissions;
