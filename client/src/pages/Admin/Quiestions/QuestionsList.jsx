import React from "react";
import { Edit3, Trash2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const QuestionsList = ({ questions, quizId, onEditQuestion, onDeleteQuestion, setError }) => {
  const { logout, navigate } = useAuth();

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      await axios.delete(`/api/admin/question/${questionId}`, {
        withCredentials: true,
      });

      onDeleteQuestion();
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to delete question");
      }
    }
  };

  return (
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
                    onClick={() => onEditQuestion(question)}
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
  );
};

export default QuestionsList;