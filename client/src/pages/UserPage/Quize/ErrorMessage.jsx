import React from "react";
import { Activity } from "lucide-react";

const ErrorMessage = ({ error, onReturnHome }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg border border-red-800/50 p-8 max-w-md text-center">
        <div className="text-red-400 mb-4">
          <Activity size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Error Loading Quiz
        </h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={onReturnHome}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
