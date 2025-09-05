import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import ScoreChip from './ScoreChip';

const GlobalLeaderboard = ({ limit, loading, globalLeaderboard, setError, setLoading }) => {
  const { logout } = useAuth();

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

  useEffect(() => {
    fetchGlobalLeaderboard();
  }, [limit]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
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
    </>
  );
};

export default GlobalLeaderboard;