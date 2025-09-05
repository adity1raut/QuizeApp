import React, { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const AddQuestionDialog = ({ quizId, onClose, onSuccess, setError }) => {
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: ["", ""],
    correctAnswer: "",
  });

  const { logout, navigate } = useAuth();

  const handleAddQuestion = async () => {
    try {
      await axios.post(
        `/api/admin/quiz/${quizId}/questions`,
        { questions: [newQuestion] },
        { withCredentials: true },
      );

      onSuccess();
      setNewQuestion({
        questionText: "",
        options: ["", ""],
        correctAnswer: "",
      });
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to add question");
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Add New Question
        </h2>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Question Text</label>
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
          <label className="block text-gray-300 mb-2">Correct Answer</label>
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
            onClick={onClose}
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
  );
};

export default AddQuestionDialog;
