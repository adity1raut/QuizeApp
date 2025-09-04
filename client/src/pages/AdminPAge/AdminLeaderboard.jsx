import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leaderboard-tabpanel-${index}`}
      aria-labelledby={`leaderboard-tab-${index}`}
      {...other}
    >
      {value === index && <div className="p-6">{children}</div>}
    </div>
  );
}

// Score Chip Component
const ScoreChip = ({ score, label, size = 'default' }) => {
  const getColorClass = (score) => {
    if (score >= 90) return 'bg-green-800';
    if (score >= 70) return 'bg-blue-700';
    if (score >= 50) return 'bg-orange-600';
    return 'bg-red-700';
  };

  const sizeClass = size === 'small' ? 'px-2 py-1 text-xs' : 'px-3 py-1';

  return (
    <span
      className={`${getColorClass(score)} ${sizeClass} text-white font-bold rounded-full inline-flex items-center justify-center`}
    >
      {label}
    </span>
  );
};

// Main Admin Leaderboard Component
const AdminLeaderboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [quizLeaderboard, setQuizLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userIdSearch, setUserIdSearch] = useState('');

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!isAdmin()) {
      window.location.href = '/unauthorized';
    }
  }, [isAdmin]);

  // Fetch global leaderboard
  const fetchGlobalLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/leaderboard/global?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGlobalLeaderboard(response.data.leaderboard);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch global leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // Fetch quiz leaderboard
  const fetchQuizLeaderboard = async () => {
    if (!selectedQuiz) return;
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/leaderboard/quiz/${selectedQuiz}?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizLeaderboard(response.data.leaderboard);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch quiz leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available quizzes
  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/quizzes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(response.data.quizzes || []);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    }
  };

  // Fetch user stats
  const fetchUserStats = async (userId) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/user-stats/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (tabValue === 0) {
      fetchGlobalLeaderboard();
    } else if (tabValue === 1 && selectedQuiz) {
      fetchQuizLeaderboard();
    }
  }, [tabValue, selectedQuiz, limit]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
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

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-500/20';
    if (rank === 2) return 'bg-gray-400/20';
    if (rank === 3) return 'bg-amber-700/20';
    return 'bg-gray-800 hover:bg-gray-700/50';
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-yellow-500';
    if (rank === 2) return 'bg-gray-400';
    if (rank === 3) return 'bg-amber-700';
    return 'bg-gray-600';
  };

  // Show loading if still checking authentication
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show unauthorized message if not admin
  if (!isAdmin()) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center bg-gray-800 p-6 rounded-lg">
        <div className="bg-red-900 text-red-200 px-4 py-3 rounded mb-4">
          You don't have permission to access this page.
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">Admin Leaderboard</h1>

        {error && (
          <div className="bg-red-900 text-red-200 px-4 py-3 rounded mb-6 relative">
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="absolute top-0 right-0 p-3"
            >
              <svg className="h-5 w-5 text-red-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-700">
            <div className="flex -mb-px">
              <button
                onClick={() => handleTabChange(null, 0)}
                className={`py-4 px-6 font-medium text-sm ${tabValue === 0 ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
              >
                Global Leaderboard
              </button>
              <button
                onClick={() => handleTabChange(null, 1)}
                className={`py-4 px-6 font-medium text-sm ${tabValue === 1 ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
              >
                Quiz Leaderboard
              </button>
              <button
                onClick={() => handleTabChange(null, 2)}
                className={`py-4 px-6 font-medium text-sm ${tabValue === 2 ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
              >
                User Statistics
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-end">
            <div className="relative">
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={25}>Top 25</option>
                <option value={50}>Top 50</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <TabPanel value={tabValue} index={0}>
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">Global Leaderboard</h2>
          
          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Total Score</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Quizzes Taken</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Average Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {globalLeaderboard.map((user) => (
                      <tr key={user._id} className={getRankColor(user.rank)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`${getRankBadgeColor(user.rank)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                            #{user.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">{user.totalScore}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">{user.totalQuizzes}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <ScoreChip score={user.averageScore} label={`${user.averageScore}%`} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(user.lastActivity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">Quiz Leaderboard</h2>
          
          <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
            <div className="relative">
              <select
                value={selectedQuiz}
                onChange={(e) => setSelectedQuiz(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pr-8"
              >
                <option value="">Select Quiz</option>
                {quizzes.map((quiz) => (
                  <option key={quiz._id} value={quiz._id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedQuiz && quizLeaderboard.length > 0 ? (
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Best Score</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Attempts</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Best Score Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {quizLeaderboard.map((user) => (
                      <tr key={user._id} className={getRankColor(user.rank)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`${getRankBadgeColor(user.rank)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                            #{user.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <ScoreChip score={user.bestScore} label={`${user.bestScore}%`} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">{user.totalAttempts}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(user.bestScoreDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
              <p className="text-gray-400">
                {selectedQuiz ? 'No data available for this quiz' : 'Please select a quiz to view its leaderboard'}
              </p>
            </div>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">User Statistics</h2>
          
          <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter User ID"
                value={userIdSearch}
                onChange={(e) => setUserIdSearch(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
              />
              <button
                onClick={() => fetchUserStats(userIdSearch)}
                disabled={!userIdSearch}
                className={`py-2 px-6 rounded-lg font-medium ${!userIdSearch ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Search
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : userStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Overall Statistics</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Rank:</span> {userStats.rank ? `#${userStats.rank}` : 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Total Submissions:</span> {userStats.stats.totalSubmissions}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Total Score:</span> {userStats.stats.totalScore}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-semibold">Average Score:</span>
                    <ScoreChip 
                      score={userStats.stats.averageScore} 
                      label={`${userStats.stats.averageScore.toFixed(2)}%`} 
                      size="small"
                    />
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-semibold">Best Score:</span>
                    <ScoreChip 
                      score={userStats.stats.bestScore} 
                      label={`${userStats.stats.bestScore}%`} 
                      size="small"
                    />
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-semibold">Worst Score:</span>
                    <ScoreChip 
                      score={userStats.stats.worstScore} 
                      label={`${userStats.stats.worstScore}%`} 
                      size="small"
                    />
                  </p>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold text-blue-400 mb-4 mt-6">Quiz Breakdown</h3>
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quiz Title</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Attempts</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Best Score</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Average Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Attempt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {userStats.quizBreakdown.map((quiz) => (
                          <tr key={quiz._id} className="hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{quiz.quizTitle}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">{quiz.attempts}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              <ScoreChip 
                                score={quiz.bestScore} 
                                label={`${quiz.bestScore}%`} 
                                size="small"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              <ScoreChip 
                                score={quiz.averageScore} 
                                label={`${quiz.averageScore.toFixed(2)}%`} 
                                size="small"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(quiz.lastAttempt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
              <p className="text-gray-400">
                Enter a User ID to view their statistics
              </p>
            </div>
          )}
        </TabPanel>
      </div>
    </div>
  );
};

export default AdminLeaderboard;