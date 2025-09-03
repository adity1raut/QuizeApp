import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  AlertCircle,
  CheckCircle,
  Loader2,
  BarChart3,
  FileText,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const QuizDetail = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ title: "", description: "" });

  const { isAuthenticated, isAdmin, logout } = useAuth();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!isAuthenticated || !isAdmin()) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/quiz/${quizId}`, {
          withCredentials: true,
        });

        setQuiz(response.data.data.quiz);
        setEditData({
          title: response.data.data.quiz.title,
          description: response.data.data.quiz.description,
        });
        setError("");
      } catch (err) {
        if (err.response?.status === 401) {
          // Unauthorized - redirect to login
          logout();
          navigate("/login");
        } else {
          setError(err.response?.data?.error || "Failed to fetch quiz details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, isAuthenticated, isAdmin, logout, navigate]);

  const handleUpdateQuiz = async () => {
    try {
      const response = await axios.put(`/api/admin/quiz/${quizId}`, editData, {
        withCredentials: true,
      });

      setQuiz(response.data.data.quiz);
      setSuccess("Quiz updated successfully!");
      setEditDialogOpen(false);
    } catch (err) {
      if (err.response?.status === 401) {
        // Unauthorized - redirect to login
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to update quiz");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">Quiz not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        {error && (
          <div className="flex items-center bg-red-900/30 border border-red-700 rounded-md p-4 mb-6">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              &times;
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center bg-green-900/30 border border-green-700 rounded-md p-4 mb-6">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <span>{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="ml-auto text-green-400 hover:text-green-300"
            >
              &times;
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${quiz.isActive ? "bg-green-900/30 text-green-400" : "bg-gray-700 text-gray-400"}`}
          >
            {quiz.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Quiz Details</h2>
            <button
              onClick={() => setEditDialogOpen(true)}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Edit3 className="h-5 w-5" />
            </button>
          </div>

          <p className="mb-4 text-gray-300">{quiz.description}</p>

          <div className="text-sm text-gray-400 space-y-1">
            <p>Created: {new Date(quiz.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(quiz.updatedAt).toLocaleString()}</p>
            <p className="mt-2">Questions: {quiz.questions.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate(`/admin/quiz/${quizId}/questions`)}
            className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            Manage Questions
          </button>
          <button
            onClick={() => navigate(`/admin/quiz/${quizId}/stats`)}
            className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Statistics
          </button>
        </div>

        {/* Edit Quiz Dialog */}
        {editDialogOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Edit Quiz</h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
                <button
                  onClick={() => setEditDialogOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateQuiz}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDetail;
