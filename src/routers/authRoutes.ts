import express from "express";
import { requestOTP, validateToken, verifyOTP } from "../controllers/AuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.get("/validate-token", protect, validateToken);

export default router;
