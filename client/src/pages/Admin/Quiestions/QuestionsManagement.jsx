import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { ArrowLeft, Plus } from "lucide-react";
import QuestionsList from "./QuestionsList";
import AddQuestionDialog from "./AddQuestionDialog";
import EditQuestionDialog from "./EditQuestionDialog";
import StatusMessages from "./StatusMessages";
import LoadingSpinner from "./LoadingSpinner";

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

  const refreshQuestions = async () => {
    try {
      const response = await axios.get(`/api/admin/quiz/${quizId}/questions`, {
        withCredentials: true,
      });
      setQuestions(response.data.data.questions);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to refresh questions");
    }
  };

  const handleAddSuccess = () => {
    setSuccess("Question added successfully!");
    setAddDialogOpen(false);
    refreshQuestions();
  };

  const handleUpdateSuccess = () => {
    setSuccess("Question updated successfully!");
    setEditDialogOpen(false);
    setCurrentQuestion(null);
    refreshQuestions();
  };

  const handleDeleteSuccess = () => {
    setSuccess("Question deleted successfully!");
    refreshQuestions();
  };

  if (loading) {
    return <LoadingSpinner />;
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

        <StatusMessages
          error={error}
          success={success}
          setError={setError}
          setSuccess={setSuccess}
        />

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

        <QuestionsList
          questions={questions}
          quizId={quizId}
          onEditQuestion={(question) => {
            setCurrentQuestion(question);
            setEditDialogOpen(true);
          }}
          onDeleteQuestion={handleDeleteSuccess}
          setError={setError}
        />

        {addDialogOpen && (
          <AddQuestionDialog
            quizId={quizId}
            onClose={() => setAddDialogOpen(false)}
            onSuccess={handleAddSuccess}
            setError={setError}
          />
        )}

        {editDialogOpen && (
          <EditQuestionDialog
            question={currentQuestion}
            onClose={() => {
              setEditDialogOpen(false);
              setCurrentQuestion(null);
            }}
            onSuccess={handleUpdateSuccess}
            setError={setError}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionsManagement;
