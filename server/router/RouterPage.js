import express from "express";
import { signupUser, verifyOtpAndCreateUser } from "../controllers/signupUser/SignUpUser.js";
import { getUserProfile, updateUserProfile, deleteUserProfile } from "../controllers/UserWork/profileUser.js";
import { loginUser, logoutUser } from "../controllers/loginUser/loginUser.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
    createQuiz,
    getQuizzes as getAdminQuizzes,
    getQuizById,
    updateQuiz,
    updateQuizStatus,
    deleteQuiz,
    addQuestionsToQuiz,
    getQuizQuestions,
    updateQuestion,
    deleteQuestion,
    getQuizStats
} from "../controllers/Admin/AdminControl.js";
import {
    getActiveQuizzes,
    startQuiz,
    submitQuiz,
    getUserSubmissions,
    getSubmissionDetails
} from "../controllers/UserWork/UserControl.js";

import { getGlobalLeaderboard, getQuizLeaderboard, getUserStats } from "../controllers/Admin/leaderboardController.js";
import { getUsers, updateUserRole, deleteUser, getAnalytics } from "../controllers/Admin/UserControl.js";

const router = express.Router();

// --- Authentication Routes ---
router.post("/api/auth/signup", signupUser);
router.post("/api/auth/verify-otp", verifyOtpAndCreateUser);
router.post("/api/auth/login", loginUser);
router.post("/api/auth/logout", logoutUser);

// --- User Profile Routes ---
router.route("/api/auth/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
    .delete(protect, deleteUserProfile);

// --- Admin Quiz Management Routes ---
router.route('/api/admin/quiz')
    .post(protect, admin, createQuiz);

router.route('/api/admin/quizzes')
    .get(protect, admin, getAdminQuizzes);

router.route('/api/admin/quiz/:quizId')
    .get(protect, admin, getQuizById)
    .put(protect, admin, updateQuiz)
    .delete(protect, admin, deleteQuiz);

router.route('/api/admin/quiz/:quizId/status')
    .patch(protect, admin, updateQuizStatus);

router.route('/api/admin/quiz/:quizId/stats')
    .get(protect, admin, getQuizStats);

// --- Admin Question Management Routes ---
router.route('/api/admin/quiz/:quizId/questions')
    .post(protect, admin, addQuestionsToQuiz)
    .get(protect, admin, getQuizQuestions);

router.route('/api/admin/question/:questionId')
    .put(protect, admin, updateQuestion)
    .delete(protect, admin, deleteQuestion);

// --- Admin User Management Routes ---
router.get('/api/admin/users', protect, admin, getUsers);
router.put('/api/admin/users/:id/role', protect, admin, updateUserRole);
router.delete('/api/admin/users/:id', protect, admin, deleteUser);
router.get('/api/admin/analytics', protect, admin, getAnalytics);

// --- Admin Leaderboard Routes ---
router.get('/api/admin/leaderboard/global', protect, admin, getGlobalLeaderboard);
router.get('/api/admin/leaderboard/quiz/:quizId', protect, admin, getQuizLeaderboard);

// --- User-Facing Quiz Routes ---
router.route('/api/quizzes')
    .get(protect, getActiveQuizzes);

router.route('/api/quiz/:id/start')
    .get(protect, startQuiz);

router.route('/api/quiz/:id/submit')
    .post(protect, submitQuiz);

router.route('/api/my-submissions')
    .get(protect, getUserSubmissions);

router.route('/api/submission/:id')
    .get(protect, getSubmissionDetails);

// --- User Stats Routes (Fixed) ---
// Most specific routes first, then more general ones
router.get('/api/stats/:userId', protect, getUserStats);  // For specific user stats
router.get('/api/stats', protect, getUserStats);          // For current user stats

export default router;