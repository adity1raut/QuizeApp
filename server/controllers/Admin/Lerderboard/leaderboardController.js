import Submission from "../../../models/SubmissionSchema.js";
import mongoose from "mongoose";

export const getGlobalLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await Submission.aggregate([
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" },
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: "$score" },
          lastActivity: { $max: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          username: "$user.username",
          email: "$user.email",
          totalScore: 1,
          totalQuizzes: 1,
          averageScore: { $round: ["$averageScore", 2] },
          lastActivity: 1,
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: parseInt(limit) },
    ]);

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json({
      leaderboard: rankedLeaderboard,
      totalUsers: leaderboard.length,
    });
  } catch (error) {
    console.error("Global leaderboard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getQuizLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const { quizId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID format" });
    }

    const leaderboard = await Submission.aggregate([
      { $match: { quiz: new mongoose.Types.ObjectId(quizId) } },
      { $sort: { score: -1, createdAt: 1 } },
      {
        $group: {
          _id: "$user",
          bestScore: { $first: "$score" },
          bestScoreDate: { $first: "$createdAt" },
          totalAttempts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          username: "$user.username",
          bestScore: 1,
          bestScoreDate: 1,
          totalAttempts: 1,
        },
      },
      { $sort: { bestScore: -1 } },
      { $limit: parseInt(limit) },
    ]);

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json({
      leaderboard: rankedLeaderboard,
      quizId,
      totalParticipants: leaderboard.length,
    });
  } catch (error) {
    console.error("Quiz leaderboard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    // Check if userId is provided in params, otherwise use authenticated user's ID
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Authorization check
    if (
      req.params.userId &&
      req.params.userId !== req.user?.id &&
      req.user?.role !== "Admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get user statistics
    const stats = await Submission.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          totalScore: { $sum: "$score" },
          averageScore: { $avg: "$score" },
          bestScore: { $max: "$score" },
          worstScore: { $min: "$score" },
        },
      },
    ]);

    // Get user's rank in global leaderboard
    const userRankData = await Submission.aggregate([
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" },
        },
      },
      { $sort: { totalScore: -1 } },
      {
        $group: {
          _id: null,
          users: { $push: { user: "$_id", totalScore: "$totalScore" } },
        },
      },
      {
        $project: {
          rank: {
            $add: [
              {
                $indexOfArray: ["$users.user", userObjectId],
              },
              1,
            ],
          },
        },
      },
    ]);

    // Get quiz breakdown
    const quizBreakdown = await Submission.aggregate([
      { $match: { user: userObjectId } },
      {
        $lookup: {
          from: "quizzes",
          localField: "quiz",
          foreignField: "_id",
          as: "quizInfo",
        },
      },
      { $unwind: "$quizInfo" },
      {
        $group: {
          _id: "$quiz",
          quizTitle: { $first: "$quizInfo.title" },
          attempts: { $sum: 1 },
          bestScore: { $max: "$score" },
          averageScore: { $avg: "$score" },
          lastAttempt: { $max: "$createdAt" },
        },
      },
      { $sort: { lastAttempt: -1 } },
    ]);

    res.json({
      stats: stats[0] || {
        totalSubmissions: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
      },
      rank: userRankData[0]?.rank || null,
      quizBreakdown,
    });
  } catch (error) {
    console.error("User stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Additional helper function to get user rank
export const getUserRank = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const userRank = await Submission.aggregate([
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" },
        },
      },
      { $sort: { totalScore: -1 } },
      {
        $group: {
          _id: null,
          users: { $push: { user: "$_id", totalScore: "$totalScore" } },
        },
      },
      {
        $project: {
          rank: {
            $add: [
              {
                $indexOfArray: ["$users.user", userObjectId],
              },
              1,
            ],
          },
          totalUsers: { $size: "$users" },
        },
      },
    ]);

    res.json({
      rank: userRank[0]?.rank || null,
      totalUsers: userRank[0]?.totalUsers || 0,
    });
  } catch (error) {
    console.error("User rank error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
