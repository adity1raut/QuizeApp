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
  getQuizStats,
} from "../controllers/Admin/AdminControl.js";

import {
  getActiveQuizzes,
  startQuiz,
  submitQuiz,
  getUserSubmissions,
  getSubmissionDetails,
} from "../controllers/UserWork/UserControl.js";

import {
  getGlobalLeaderboard,
  getQuizLeaderboard,
  getUserStats,
} from "../controllers/Admin/leaderboardController.js";

import {
  getUsers,
  updateUserRole,
  deleteUser,
  getAnalytics,
} from "../controllers/Admin/UserControl.js";

const router = express.Router();

/* ================================
   AUTHENTICATION ROUTES
================================ */
router.post("/api/auth/signup", signupUser);
router.post("/api/auth/verify-otp", verifyOtpAndCreateUser);
router.post("/api/auth/login", loginUser);
router.post("/api/auth/logout", logoutUser);

/* ================================
   USER PROFILE ROUTES
================================ */
router
  .route("/api/auth/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

/* ================================
   ADMIN QUIZ MANAGEMENT
================================ */
router
  .route("/api/admin/quiz")
  .post(protect, admin, createQuiz);

router
  .route("/api/admin/quizzes")
  .get(protect, admin, getAdminQuizzes);

router
  .route("/api/admin/quiz/:quizId")
  .get(protect, admin, getQuizById)
  .put(protect, admin, updateQuiz)
  .delete(protect, admin, deleteQuiz);

router.patch("/api/admin/quiz/:quizId/status", protect, admin, updateQuizStatus);
router.get("/api/admin/quiz/:quizId/stats", protect, admin, getQuizStats);

/* ================================
   ADMIN QUESTION MANAGEMENT
================================ */
router
  .route("/api/admin/quiz/:quizId/questions")
  .post(protect, admin, addQuestionsToQuiz)
  .get(protect, admin, getQuizQuestions);

router
  .route("/api/admin/question/:questionId")
  .put(protect, admin, updateQuestion)
  .delete(protect, admin, deleteQuestion);

/* ================================
   ADMIN USER MANAGEMENT
================================ */
router.get("/api/admin/users", protect, admin, getUsers);
router.put("/api/admin/users/:id/role", protect, admin, updateUserRole);
router.delete("/api/admin/users/:id", protect, admin, deleteUser);
router.get("/api/admin/analytics", protect, admin, getAnalytics);

/* ================================
   ADMIN LEADERBOARD
================================ */
router.get("/api/admin/leaderboard/global", protect, admin, getGlobalLeaderboard);
router.get("/api/admin/leaderboard/quiz/:quizId", protect, admin, getQuizLeaderboard);

/* ================================
   USER QUIZ ROUTES
================================ */
router.get("/api/quizzes", protect, getActiveQuizzes);
router.get("/api/quiz/:id/start", protect, startQuiz);
router.post("/api/quiz/:id/submit", protect, submitQuiz);
router.get("/api/my-submissions", protect, getUserSubmissions);
router.get("/api/submission/:id", protect, getSubmissionDetails);

/* ================================
   USER STATS
================================ */
// More specific route first
router.get("/api/stats/:userId", protect, getUserStats);
// Current user stats
router.get("/api/stats", protect, getUserStats);

export default router;
