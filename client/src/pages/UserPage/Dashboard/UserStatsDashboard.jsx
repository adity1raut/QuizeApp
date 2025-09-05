import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { User, Activity } from "lucide-react";
import StatCard from "./StatCard";
import StatsHeader from "./StatsHeader";
import QuizBreakdownTable from "./QuizBreakdownTable";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import EmptyState from "./EmptyState";

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

      const endpoint = userId ? `/api/stats/${userId}` : "/api/stats";
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch statistics");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to fetch user statistics");
      console.error("Stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchUserStats} />;
  }

  if (!stats) {
    return <EmptyState isOwnStats={isOwnStats} hasSubmissions={false} />;
  }

  const { stats: userStats, rank, quizBreakdown } = stats;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <StatsHeader isOwnStats={isOwnStats} />

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
            value={
              userStats.averageScore ? userStats.averageScore.toFixed(1) : "0.0"
            }
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
            value={rank ? `#${rank}` : "Unranked"}
            color="red"
          />
        </div>

        {/* Quiz Breakdown */}
        {quizBreakdown && quizBreakdown.length > 0 ? (
          <QuizBreakdownTable quizBreakdown={quizBreakdown} />
        ) : (
          <EmptyState
            isOwnStats={isOwnStats}
            hasSubmissions={userStats.totalSubmissions > 0}
          />
        )}
      </div>
    </div>
  );
};

export default UserStatsDashboard;
