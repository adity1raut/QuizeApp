import User from "../../models/UserSchema.js";
import Submission from "../../models/SubmissionSchema.js";

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalUsers: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a user's role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a user and their submissions
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also delete user's submissions
    await Submission.deleteMany({ user: req.params.id });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get analytics for the admin dashboard
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrationTrend = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const submissionTrend = await Submission.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          submissions: { $sum: 1 },
          averageScore: { $avg: "$score" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const activeUsers = await Submission.aggregate([
      {
        $group: {
          _id: "$user",
          submissionCount: { $sum: 1 },
          totalScore: { $sum: "$score" },
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
          submissionCount: 1,
          totalScore: 1,
          lastActivity: 1,
        },
      },
      { $sort: { submissionCount: -1 } },
      { $limit: 10 },
    ]);

    const scoreDistribution = await Submission.aggregate([
      {
        $bucket: {
          groupBy: "$score",
          boundaries: [0, 20, 40, 60, 80, 100],
          default: "other",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    res.json({
      overview: {
        totalUsers,
        totalSubmissions,
        averageScore:
          (
            await Submission.aggregate([
              { $group: { _id: null, avg: { $avg: "$score" } } },
            ])
          )[0]?.avg?.toFixed(2) || 0,
      },
      trends: {
        registrations: registrationTrend,
        submissions: submissionTrend,
      },
      activeUsers,
      scoreDistribution,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
