import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; 
import { User, Trophy, Target, BarChart3, Calendar, Award, TrendingUp, Activity } from 'lucide-react';

const UserStatsDashboard = ({ userId = null }) => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Determine which user's stats to fetch
  const targetUserId = userId || user?.id;
  const isOwnStats = !userId || userId === user?.id;

  useEffect(() => {
    if (isAuthenticated && targetUserId) {
      fetchUserStats();
    }
  }, [isAuthenticated, targetUserId]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = userId ? `/api/stats/${userId}` : '/api/stats';
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch statistics');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch user statistics');
      console.error('Stats fetch error:', err);
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

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-900/20 text-blue-300 border-blue-700/30",
      green: "bg-green-900/20 text-green-300 border-green-700/30",
      purple: "bg-purple-900/20 text-purple-300 border-purple-700/30",
      orange: "bg-orange-900/20 text-orange-300 border-orange-700/30",
      red: "bg-red-900/20 text-red-300 border-red-700/30"
    };

    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow hover:border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg border border-red-800/50 p-8 max-w-md text-center">
          <div className="text-red-400 mb-4">
            <Activity size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading Stats</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchUserStats}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Statistics Available</h3>
          <p className="text-gray-400">No quiz submissions found for this user.</p>
        </div>
      </div>
    );
  }

  const { stats: userStats, rank, quizBreakdown } = stats;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {isOwnStats ? 'Your Statistics' : 'User Statistics'}
          </h1>
          <p className="text-gray-400 mt-2">
            {isOwnStats ? 'Track your quiz performance and progress' : 'Performance overview'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={Activity}
            title="Total Submissions"
            value={userStats.totalSubmissions}
            color="blue"
          />
          <StatCard
            icon={Trophy}
            title="Total Score"
            value={userStats.totalScore}
            color="green"
          />
          <StatCard
            icon={Target}
            title="Average Score"
            value={userStats.averageScore ? userStats.averageScore.toFixed(1) : '0.0'}
            color="purple"
          />
          <StatCard
            icon={Award}
            title="Best Score"
            value={userStats.bestScore || 0}
            color="orange"
          />
          <StatCard
            icon={TrendingUp}
            title="Global Rank"
            value={rank ? `#${rank}` : 'Unranked'}
            color="red"
          />
        </div>

        {/* Quiz Breakdown */}
        {quizBreakdown && quizBreakdown.length > 0 && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center">
                <BarChart3 className="text-gray-400 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-white">Quiz Performance Breakdown</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Quiz Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Attempts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Best Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Average Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Last Attempt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {quizBreakdown.map((quiz, index) => (
                    <tr key={quiz._id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{quiz.quizTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{quiz.attempts}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-400">{quiz.bestScore}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{quiz.averageScore.toFixed(1)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300 flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-500" />
                          {formatDate(quiz.lastAttempt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State for Quiz Breakdown */}
        {(!quizBreakdown || quizBreakdown.length === 0) && userStats.totalSubmissions === 0 && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm p-12 text-center">
            <BarChart3 size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Quiz Activity Yet</h3>
            <p className="text-gray-400">
              {isOwnStats 
                ? 'Start taking quizzes to see your performance statistics here.' 
                : 'This user hasn\'t taken any quizzes yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStatsDashboard;