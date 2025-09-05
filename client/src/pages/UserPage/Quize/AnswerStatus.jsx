import React from "react";
import { BarChart3, CheckCircle } from "lucide-react";

const AnswerStatus = ({ answeredCount, totalQuestions }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center text-gray-300 mb-3 sm:mb-0">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
          <span>
            <span className="font-semibold text-white">{answeredCount}</span> of{" "}
            <span className="font-semibold text-white">{totalQuestions}</span> questions answered
          </span>
        </div>

        <div className="flex items-center">
          <div className="flex mr-3 text-sm text-gray-400">
            <div className="flex items-center mr-3">
              <div className="h-3 w-3 rounded-full bg-green-400 mr-1"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-gray-600 mr-1"></div>
              <span>Unanswered</span>
            </div>
          </div>
          
          {answeredCount === totalQuestions && (
            <div className="bg-green-900/30 text-green-300 px-3 py-1.5 rounded-lg flex items-center text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              All questions answered
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerStatus;