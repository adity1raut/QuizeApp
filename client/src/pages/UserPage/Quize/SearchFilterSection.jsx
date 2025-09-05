import React from "react";
import { Search, Star } from "lucide-react";

const SearchFilterSection = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 shadow-lg mb-8">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700/60 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All Quizzes
          </button>
          <button
            onClick={() => onFilterChange("free")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "free"
                ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Free
          </button>
          <button
            onClick={() => onFilterChange("premium")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
              filter === "premium"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Star className="h-4 w-4 mr-1 fill-current" />
            Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterSection;
