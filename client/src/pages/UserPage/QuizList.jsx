import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  AlertCircle,
  Calendar,
  User,
  ArrowRight,
  BookOpen,
  Loader2,
  Star,
  BarChart3,
  Clock,
  Trophy,
  Search,
  Filter,
  Zap,
  Brain,
  Target
} from "lucide-react";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, premium, free

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("/api/quizzes");
      setQuizzes(response.data.quizzes);
    } catch (error) {
      setError("Failed to fetch quizzes");
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter quizzes based on search term and filter
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "premium" && quiz.isPremium) || 
                         (filter === "free" && !quiz.isPremium);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-14 w-14 text-blue-500 animate-spin mx-auto" />
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
          </div>
          <p className="mt-4 text-gray-300 text-lg">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700">
          <div className="relative mb-4">
            <AlertCircle className="h-14 w-14 text-red-400 mx-auto" />
            <div className="absolute -inset-2 bg-red-500/10 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-xl font-medium text-red-300 mb-2">
            Error Loading Quizzes
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchQuizzes}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/20"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full mb-5">
            <Brain className="h-10 w-10 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Quiz Portal
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Test your knowledge with our curated collection of quizzes. Select a
            quiz below to get started on your learning journey!
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/60 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "all" 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All Quizzes
              </button>
              <button
                onClick={() => setFilter("free")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "free" 
                    ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setFilter("premium")}
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

        {filteredQuizzes.length === 0 ? (
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
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="mt-4 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-blue-400" />
                Available Quizzes
                <span className="ml-3 text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
                  {filteredQuizzes.length} {filteredQuizzes.length === 1 ? "Quiz" : "Quizzes"}
                </span>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-gray-800/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
                        {quiz.title}
                      </h3>
                      {quiz.isPremium && (
                        <span className="flex items-center text-amber-400 text-sm bg-amber-900/30 px-2.5 py-1 rounded-full border border-amber-700/50">
                          <Star className="h-3.5 w-3.5 mr-1 fill-current" />
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-5 line-clamp-3">
                      {quiz.description}
                    </p>

                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="flex items-center mr-4">
                          <User className="h-3.5 w-3.5 mr-1.5" />
                          <span>{quiz.createdBy.username}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          <span>
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <BookOpen className="h-4 w-4 mr-1.5" />
                        <span>
                          {quiz.questions.length} {quiz.questions.length === 1 ? "Question" : "Questions"}
                        </span>
                      </div>
                      {quiz.timeLimit && (
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-4 w-4 mr-1.5" />
                          <span>{quiz.timeLimit} min</span>
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/quiz/${quiz._id}`}
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/20 group/btn"
                    >
                      Start Quiz
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizList;