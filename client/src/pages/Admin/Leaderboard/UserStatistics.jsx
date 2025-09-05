import React from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import ScoreChip from "./ScoreChip";

const UserStatistics = ({
  userIdSearch,
  setUserIdSearch,
  userStats,
  loading,
  setError,
  setLoading,
  setUserStats,
}) => {
  const { logout } = useAuth();

  const fetchUserStats = async (userId) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/admin/user-stats/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserStats(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch user statistics",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">
        User Statistics
      </h2>

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
            className={`py-2 px-6 rounded-lg font-medium ${!userIdSearch ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
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
            <h3 className="text-lg font-semibold text-blue-400 mb-4">
              Overall Statistics
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Rank:</span>{" "}
                {userStats.rank ? `#${userStats.rank}` : "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Total Submissions:</span>{" "}
                {userStats.stats.totalSubmissions}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Total Score:</span>{" "}
                {userStats.stats.totalScore}
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
            <h3 className="text-lg font-semibold text-blue-400 mb-4 mt-6">
              Quiz Breakdown
            </h3>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Quiz Title
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Attempts
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Best Score
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Average Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Last Attempt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {userStats.quizBreakdown.map((quiz) => (
                      <tr key={quiz._id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {quiz.quizTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">
                          {quiz.attempts}
                        </td>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(quiz.lastAttempt)}
                        </td>
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
    </>
  );
};

export default UserStatistics;
