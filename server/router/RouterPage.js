import express from "express";
import { signupUser, verifyOtpAndCreateUser } from "../controllers/signupUser/SignUpUser.js";
import { getUserProfile,updateUserProfile,deleteUserProfile } from "../controllers/UserWork/profileUser.js";
import { loginUser, logoutUser } from "../controllers/loginUser/loginUser.js";
import { protect, admin } from  "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/api/auth/signup", signupUser);
router.post("/api/auth/verify-otp", verifyOtpAndCreateUser);
router.post("/api/auth/login", loginUser);
router.post("/api/auth/logout", logoutUser);
router.get("/api/auth/profile", protect, getUserProfile);
router.put("/api/auth/profile", protect, updateUserProfile);
router.delete("/api/auth/profile", protect, deleteUserProfile);

export default router;
