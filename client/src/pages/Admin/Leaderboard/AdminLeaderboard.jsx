import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import TabPanel from "./TabPanel";
import ScoreChip from "./ScoreChip";
import GlobalLeaderboard from "./GlobalLeaderboard";
import QuizLeaderboard from "./QuizLeaderboard";
import UserStatistics from "./UserStatistics";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import LimitSelector from "./LimitSelector;";
import TabNavigation from "./TabNavigation";

const AdminLeaderboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [quizLeaderboard, setQuizLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userIdSearch, setUserIdSearch] = useState("");

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!isAdmin()) {
      window.location.href = "/unauthorized";
    }
  }, [isAdmin]);

  // Fetch available quizzes
  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(response.data.quizzes || []);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
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

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  // Show loading if still checking authentication
  if (!user) {
    return <LoadingSpinner />;
  }

  // Show unauthorized message if not admin
  if (!isAdmin()) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center bg-gray-800 p-6 rounded-lg">
        <div className="bg-red-900 text-red-200 px-4 py-3 rounded mb-4">
          You don't have permission to access this page.
        </div>
        <button
          onClick={() => (window.location.href = "/")}
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
        <h1 className="text-3xl font-bold text-blue-400 mb-6">
          Admin Leaderboard
        </h1>

        <ErrorMessage error={error} setError={setError} />

        <TabNavigation tabValue={tabValue} handleTabChange={handleTabChange} />

        <LimitSelector limit={limit} setLimit={setLimit} />

        <TabPanel value={tabValue} index={0}>
          <GlobalLeaderboard
            limit={limit}
            loading={loading}
            globalLeaderboard={globalLeaderboard}
            setError={setError}
            setLoading={setLoading}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <QuizLeaderboard
            selectedQuiz={selectedQuiz}
            setSelectedQuiz={setSelectedQuiz}
            quizzes={quizzes}
            limit={limit}
            loading={loading}
            quizLeaderboard={quizLeaderboard}
            setError={setError}
            setLoading={setLoading}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <UserStatistics
            userIdSearch={userIdSearch}
            setUserIdSearch={setUserIdSearch}
            userStats={userStats}
            loading={loading}
            setError={setError}
            setLoading={setLoading}
            setUserStats={setUserStats}
          />
        </TabPanel>
      </div>
    </div>
  );
};

export default AdminLeaderboard;
