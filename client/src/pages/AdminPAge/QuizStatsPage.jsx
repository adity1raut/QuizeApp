import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  Calendar, 
  Edit3, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { useAuth } from "../../contexts/AuthContext"

const QuizStatsPage = () => {
  const [quizStats, setQuizStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizId, setQuizId] = useState('');
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();

  // In a real app, this would come from route params or context
  useEffect(() => {
    if (!authLoading) {
      checkAccess();
    }
  }, [authLoading]);

  const checkAccess = () => {
    if (!isAuthenticated) {
      setError('Authentication required. Please log in.');
      setLoading(false);
      return;
    }

    if (!isAdmin()) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }

    // Extract quizId from URL if needed
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 2]; // Assuming URL is /admin/quiz/:quizId/stats
    setQuizId(id);
    fetchQuizStats(id);
  };

  const fetchQuizStats = async (id) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/admin/quiz/${id}/stats`, {
        credentials: 'include', // Use cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setQuizStats(data.data);
      } else {
        setError(data.error || 'Failed to fetch quiz statistics');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchQuizStats(quizId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  // Show access denied if not admin
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="max-w-md p-6 bg-gray-800 rounded-lg shadow-lg text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-300 mb-4">
            {isAuthenticated 
              ? 'Admin privileges are required to view this page.' 
              : 'Please log in to access this page.'
            }
          </p>
          {!isAuthenticated && (
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="mt-4 text-lg">Loading quiz statistics...</p>
        </div>
      </div>
    );
  }

  if (error && !quizStats) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="max-w-md p-6 bg-gray-800 rounded-lg shadow-lg text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Statistics</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md flex items-center justify-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-purple-500" />
            Quiz Statistics
          </h1>
          <div className="flex gap-4">
            <div className="flex items-center bg-purple-900 px-3 py-1 rounded-md text-sm">
              <Shield className="h-4 w-4 mr-1" />
              Admin View
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        {/* Quiz Info Card */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">{quizStats.quiz.title}</h2>
          <p className="text-gray-400 mb-4">{quizStats.quiz.description}</p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center bg-gray-700 px-4 py-2 rounded-md">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              <span className="text-sm font-mono">ID: {quizStats.quiz._id}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Questions Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Questions</h3>
              <Edit3 className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-3xl font-bold">{quizStats.stats.totalQuestions}</p>
          </div>

          {/* Status Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Status</h3>
              {quizStats.stats.isActive ? (
                <Eye className="h-6 w-6 text-green-500" />
              ) : (
                <EyeOff className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${quizStats.stats.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{quizStats.stats.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          {/* Created At Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Created</h3>
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-sm">{formatDate(quizStats.stats.createdAt)}</p>
          </div>

          {/* Updated At Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Last Updated</h3>
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-sm">{formatDate(quizStats.stats.updatedAt)}</p>
          </div>
        </div>

        {/* Additional Stats Placeholder */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 mr-2 text-green-500" />
            <h2 className="text-xl font-semibold">Performance Overview</h2>
          </div>
          
          <div className="text-center py-10 text-gray-400">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>More detailed analytics coming soon</p>
            <p className="text-sm mt-2">Future versions will include participant metrics, question analysis, and performance trends</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default QuizStatsPage;