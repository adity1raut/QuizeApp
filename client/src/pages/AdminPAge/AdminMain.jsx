import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  HelpCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "" });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQuizzes: 0,
    hasNext: false,
    hasPrev: false,
  });

  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch quizzes from API
  const fetchQuizzes = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/quizzes?page=${page}`, {
        withCredentials: true,
      });

      setQuizzes(response.data.data.quizzes);
      setPagination(response.data.data.pagination);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to fetch quizzes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      fetchQuizzes();
    }
  }, [isAuthenticated, isAdmin]);

  // Create new quiz
  const handleCreateQuiz = async () => {
    try {
      const response = await axios.post(`/api/admin/quiz`, newQuiz, {
        withCredentials: true,
      });

      setSuccess("Quiz created successfully!");
      setCreateDialogOpen(false);
      setNewQuiz({ title: "", description: "" });
      fetchQuizzes();
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to create quiz");
      }
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await axios.delete(`/api/admin/quiz/${quizId}`, {
        withCredentials: true,
      });

      setSuccess("Quiz deleted successfully!");
      fetchQuizzes();
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to delete quiz");
      }
    }
  };

  // Toggle quiz status
  const handleToggleStatus = async (quizId, currentStatus) => {
    try {
      await axios.patch(
        `/api/admin/quiz/${quizId}/status`,
        { isActive: !currentStatus },
        { withCredentials: true },
      );

      setSuccess(
        `Quiz ${!currentStatus ? "activated" : "deactivated"} successfully!`,
      );
      fetchQuizzes();
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to update quiz status");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
            Quiz Management
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Welcome, {user?.name}</span>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus size={20} className="mr-2" />
              Create New Quiz
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={18} />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span>{success}</span>
            <button onClick={() => setSuccess("")}>
              <X size={18} />
            </button>
          </div>
        )}

        {quizzes.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No quizzes found</h2>
            <p className="text-gray-400">
              Create your first quiz to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-white truncate max-w-[70%]">
                      {quiz.title}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${quiz.isActive ? "bg-green-900/30 text-green-400" : "bg-gray-700 text-gray-400"}`}
                    >
                      {quiz.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {quiz.description}
                  </p>

                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-300">
                      Questions: {quiz.questions?.length || 0}
                    </span>
                    <span className="text-gray-500">
                      Created: {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-700">
                    <button
                      className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                      onClick={() => navigate(`/admin/quiz/${quiz._id}`)}
                      title="View"
                    >
                      <Eye size={20} />
                    </button>

                    <button
                      className="text-purple-400 hover:text-purple-300 transition-colors p-1"
                      onClick={() =>
                        navigate(`/admin/quiz/${quiz._id}/questions`)
                      }
                      title="Questions"
                    >
                      <HelpCircle size={20} />
                    </button>

                    <button
                      className="text-yellow-400 hover:text-yellow-300 transition-colors p-1"
                      onClick={() => navigate(`/admin/quiz/${quiz._id}/stats`)}
                      title="Statistics"
                    >
                      <BarChart3 size={20} />
                    </button>

                    <button
                      className="text-cyan-400 hover:text-cyan-300 transition-colors p-1"
                      onClick={() =>
                        handleToggleStatus(quiz._id, quiz.isActive)
                      }
                      title="Toggle Status"
                    >
                      <Edit3 size={20} />
                    </button>

                    <button
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => fetchQuizzes(pagination.currentPage - 1)}
              className={`flex items-center px-4 py-2 rounded-lg ${pagination.hasPrev ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-gray-800/50 text-gray-500 cursor-not-allowed"} transition-colors`}
            >
              <ChevronLeft size={18} className="mr-1" />
              Previous
            </button>

            <span className="text-gray-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={!pagination.hasNext}
              onClick={() => fetchQuizzes(pagination.currentPage + 1)}
              className={`flex items-center px-4 py-2 rounded-lg ${pagination.hasNext ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-gray-800/50 text-gray-500 cursor-not-allowed"} transition-colors`}
            >
              Next
              <ChevronRight size={18} className="ml-1" />
            </button>
          </div>
        )}

        {/* Create Quiz Dialog */}
        {createDialogOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Create New Quiz
              </h2>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Quiz Title</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newQuiz.title}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, title: e.target.value })
                  }
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  rows="3"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newQuiz.description}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  onClick={handleCreateQuiz}
                >
                  <Check size={18} className="mr-1" />
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
