import React from "react";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

const QuizNavigation = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  submitting,
  answeredCount
}) => {
  return (
    <div className="flex justify-between mb-8">
      <button
        onClick={onPrevious}
        disabled={currentQuestion === 0}
        className={`flex items-center px-5 py-3 rounded-lg font-medium transition-all ${
          currentQuestion === 0
            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
        }`}
      >
        <ChevronLeft className="h-5 w-5 mr-2" />
        Previous
      </button>

      {currentQuestion < totalQuestions - 1 ? (
        <button
          onClick={onNext}
          className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Next
          <ChevronRight className="h-5 w-5 ml-2" />
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={
            submitting ||
            answeredCount < totalQuestions
          }
          className={`flex items-center px-5 py-3 rounded-lg font-medium transition-all ${
            submitting || answeredCount < totalQuestions
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Submit Quiz
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default QuizNavigation;