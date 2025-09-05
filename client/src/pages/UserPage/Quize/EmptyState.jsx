import React from "react";
import { Target } from "lucide-react";

const EmptyState = ({ searchTerm, onClearSearch }) => {
  return (
    <div className="text-center py-16 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gray-700/50 rounded-full">
          <Target className="h-10 w-10 text-gray-400" />
        </div>
      </div>
      <h3 className="text-xl font-medium text-gray-300 mb-2">
        {searchTerm ? "No matching quizzes found" : "No Quizzes Available"}
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {searchTerm 
          ? "Try adjusting your search terms or filters."
          : "There are no active quizzes at the moment. Please check back later."
        }
      </p>
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="mt-4 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Clear Search
        </button>
      )}
    </div>
  );
};

export default EmptyState;