import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  User,
  Clock,
  Eye,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
  LogIn,
  Shield
} from 'lucide-react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ActiveQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        fetchActiveQuizzes();
      } else {
        setLoading(false);
      }
    }
  }, [authLoading, isAuthenticated]);

  const fetchActiveQuizzes = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/quizzes', {
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view quizzes');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setQuizzes(data.quizzes);
      } else {
        setError(data.message || 'Failed to fetch quizzes');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return formatDate(dateString);
  };

  // Function to handle starting a quiz
  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const filteredAndSortedQuizzes = quizzes
    .filter(quiz => 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="mt-4 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="max-w-md p-6 bg-gray-800 rounded-lg shadow-lg text-center">
          <LogIn className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-300 mb-4">Please log in to view active quizzes</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md flex items-center justify-center mx-auto"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="mt-4 text-lg">Loading active quizzes...</p>
        </div>
      </div>
    );
  }

  if (error && !quizzes.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="max-w-md p-6 bg-gray-800 rounded-lg shadow-lg text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Quizzes</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={fetchActiveQuizzes}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md flex items-center justify-center mx-auto"
          >
            <Loader2 className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <BookOpen className="h-8 w-8 mr-3 text-purple-500" />
              Active Quizzes
            </h1>
            <p className="text-gray-400 mt-2">
              {quizzes.length} active quiz{quizzes.length !== 1 ? 'zes' : ''} available
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none w-full"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Alphabetical</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        {/* Quizzes Grid */}
        {filteredAndSortedQuizzes.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            {searchTerm ? (
              <>
                <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No matching quizzes found</h3>
                <p className="text-gray-400">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No active quizzes available</h3>
                <p className="text-gray-400">Check back later for new quizzes</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedQuizzes.map((quiz) => (
              <div key={quiz._id} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-400">Active</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTimeSince(quiz.createdAt)}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors duration-200">
                  {quiz.title}
                </h3>
                
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {quiz.description || 'No description provided.'}
                </p>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                  <div className="flex items-center text-sm text-gray-400">
                    <User className="h-4 w-4 mr-1" />
                    {quiz.createdBy?.username || 'Unknown'}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(quiz.createdAt)}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleStartQuiz(quiz._id)} 
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center group-hover:bg-purple-700 transition-colors duration-200"
                >
                  Start Quiz
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredAndSortedQuizzes.length > 0 && searchTerm && (
          <div className="mt-6 text-center text-gray-400">
            Showing {filteredAndSortedQuizzes.length} of {quizzes.length} quizzes
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}
      </div>  
    </div>
  );
};

export default ActiveQuizzesPage;