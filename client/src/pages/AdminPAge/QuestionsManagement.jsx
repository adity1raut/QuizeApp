import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowLeft, Plus, Edit3, Trash2, X, Check } from "lucide-react";

const QuestionsManagement = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: ["", ""],
    correctAnswer: "",
  });

  const { isAuthenticated, isAdmin, logout } = useAuth();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !isAdmin()) return;

      try {
        setLoading(true);

        // Fetch quiz details
        const quizResponse = await axios.get(`/api/admin/quiz/${quizId}`, {
          withCredentials: true,
        });
        setQuiz(quizResponse.data.data.quiz);

        // Fetch questions
        const questionsResponse = await axios.get(
          `/api/admin/quiz/${quizId}/questions`,
          {
            withCredentials: true,
          },
        );
        setQuestions(questionsResponse.data.data.questions);

        setError("");
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError(err.response?.data?.error || "Failed to fetch data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId, isAuthenticated, isAdmin, logout, navigate]);

  const handleAddQuestion = async () => {
    try {
      await axios.post(
        `/api/admin/quiz/${quizId}/questions`,
        { questions: [newQuestion] },
        { withCredentials: true },
      );

      setSuccess("Question added successfully!");
      setAddDialogOpen(false);
      setNewQuestion({
        questionText: "",
        options: ["", ""],
        correctAnswer: "",
      });

      // Refresh questions list
      const response = await axios.get(`/api/admin/quiz/${quizId}/questions`, {
        withCredentials: true,
      });
      setQuestions(response.data.data.questions);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to add question");
      }
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      await axios.put(
        `/api/admin/question/${currentQuestion._id}`,
        currentQuestion,
        { withCredentials: true },
      );

      setSuccess("Question updated successfully!");
      setEditDialogOpen(false);
      setCurrentQuestion(null);

      // Refresh questions list
      const response = await axios.get(`/api/admin/quiz/${quizId}/questions`, {
        withCredentials: true,
      });
      setQuestions(response.data.data.questions);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to update question");
      }
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      await axios.delete(`/api/admin/question/${questionId}`, {
        withCredentials: true,
      });

      setSuccess("Question deleted successfully!");

      // Refresh questions list
      const response = await axios.get(`/api/admin/quiz/${quizId}/questions`, {
        withCredentials: true,
      });
      setQuestions(response.data.data.questions);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to delete question");
      }
    }
  };

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, ""],
    });
  };

  const removeOption = (index) => {
    const newOptions = [...newQuestion.options];
    newOptions.splice(index, 1);
    setNewQuestion({
      ...newQuestion,
      options: newOptions,
    });
  };

  const updateOption = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: newOptions,
    });
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button
          onClick={() => navigate(`/admin/quiz/${quizId}`)}
          className="flex items-center text-indigo-400 hover:text-indigo-300 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Quiz
        </button>

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

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
            Manage Questions: {quiz?.title}
          </h1>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus size={20} className="mr-2" />
            Add Question
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Questions ({questions.length})
          </h2>

          {questions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No questions yet. Add your first question to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question._id}
                  className="bg-gray-700/50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">
                        {index + 1}. {question.questionText}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {question.options.map((option, optIndex) => (
                          <span
                            key={optIndex}
                            className={`px-3 py-1 rounded-full text-sm ${
                              option === question.correctAnswer
                                ? "bg-green-900/50 text-green-300 border border-green-700"
                                : "bg-gray-600/50 text-gray-300 border border-gray-500"
                            }`}
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setCurrentQuestion({ ...question });
                          setEditDialogOpen(true);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 p-1 transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question._id)}
                        className="text-red-400 hover:text-red-300 p-1 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Question Dialog */}
        {addDialogOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Add New Question
              </h2>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Question Text
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newQuestion.questionText}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      questionText: e.target.value,
                    })
                  }
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Options (mark the correct answer by selecting it below)
                </label>

                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                    />
                    {newQuestion.options.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="ml-2 text-red-500 hover:text-red-400 p-2 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={addOption}
                  className="text-indigo-400 hover:text-indigo-300 mt-2 flex items-center transition-colors"
                >
                  <Plus size={18} className="mr-1" />
                  Add Option
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">
                  Correct Answer
                </label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newQuestion.correctAnswer}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      correctAnswer: e.target.value,
                    })
                  }
                >
                  <option value="">Select correct answer</option>
                  {newQuestion.options.map(
                    (option, index) =>
                      option && (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ),
                  )}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddQuestion}
                  disabled={
                    !newQuestion.questionText ||
                    !newQuestion.correctAnswer ||
                    newQuestion.options.filter((opt) => opt).length < 2
                  }
                >
                  <Check size={18} className="mr-1" />
                  Add Question
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Question Dialog */}
        {editDialogOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Edit Question
              </h2>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Question Text
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={currentQuestion?.questionText || ""}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      questionText: e.target.value,
                    })
                  }
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Options (mark the correct answer by selecting it below)
                </label>

                {currentQuestion?.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options];
                        newOptions[index] = e.target.value;
                        setCurrentQuestion({
                          ...currentQuestion,
                          options: newOptions,
                        });
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">
                  Correct Answer
                </label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={currentQuestion?.correctAnswer || ""}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: e.target.value,
                    })
                  }
                >
                  <option value="">Select correct answer</option>
                  {currentQuestion?.options.map(
                    (option, index) =>
                      option && (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ),
                  )}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleUpdateQuestion}
                  disabled={
                    !currentQuestion?.questionText ||
                    !currentQuestion?.correctAnswer ||
                    currentQuestion.options.filter((opt) => opt).length < 2
                  }
                >
                  <Check size={18} className="mr-1" />
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

export default QuestionsManagement;
