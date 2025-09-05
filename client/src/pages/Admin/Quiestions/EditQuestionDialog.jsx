import React, { useState } from "react";
import { X, Check } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const EditQuestionDialog = ({ question, onClose, onSuccess, setError }) => {
  const [currentQuestion, setCurrentQuestion] = useState({ ...question });

  const { logout, navigate } = useAuth();

  const handleUpdateQuestion = async () => {
    try {
      await axios.put(
        `/api/admin/question/${currentQuestion._id}`,
        currentQuestion,
        { withCredentials: true },
      );

      onSuccess();
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to update question");
      }
    }
  };

  return (
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
            onClick={onClose}
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
  );
};

export default EditQuestionDialog;