import React from "react";

const TabNavigation = ({ tabValue, handleTabChange }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg mb-6">
      <div className="border-b border-gray-700">
        <div className="flex -mb-px">
          <button
            onClick={() => handleTabChange(0)}
            className={`py-4 px-6 font-medium text-sm ${tabValue === 0 ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}
          >
            Global Leaderboard
          </button>
          <button
            onClick={() => handleTabChange(1)}
            className={`py-4 px-6 font-medium text-sm ${tabValue === 1 ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}
          >
            Quiz Leaderboard
          </button>
          <button
            onClick={() => handleTabChange(2)}
            className={`py-4 px-6 font-medium text-sm ${tabValue === 2 ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}
          >
            User Statistics
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
