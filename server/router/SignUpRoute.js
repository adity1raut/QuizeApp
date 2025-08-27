import express from "express";
import { signupUser, verifyOtpAndCreateUser } from "../controllers/signupUser/SignUpUser.js";

const router = express.Router();

router.post("/api/auth/signup", signupUser);
router.post("/api/auth/verify-otp", verifyOtpAndCreateUser);

export default router;
