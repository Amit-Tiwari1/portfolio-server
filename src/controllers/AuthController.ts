import type { Request, Response } from "express";
import { User } from "../models/allmodels.js";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config(); // MUST be first

const resend = new Resend(process.env.RESEND_API_KEY);

// FORCE STRING
const DEFAULT_OTP = String(process.env.DEFAULT_OTP || "");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * REQUEST OTP
 */
export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { gmail } = req.body;

    if (!gmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ gmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Email sending (non-blocking)
    try {
      await resend.emails.send({
        from: "Portfolio Admin <onboarding@resend.dev>",
        to: gmail,
        subject: "Your OTP for Admin Login",
        html: `<h1>Your OTP is ${otp}</h1>`,
      });
    } catch (err) {
      console.error("Email failed (ignored):", err);
    }

    return res.status(200).json({
      success: true,
      message: "OTP generated. Use DEFAULT_OTP if email not received.",
    });
  } catch (error: any) {
    console.error("requestOTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Error requesting OTP",
    });
  }
};


export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { gmail, otp } = req.body;

    if (!gmail || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const user = await User.findOne({ gmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // DEBUG LOGS (remove later)
    console.log("INPUT OTP:", otp);
    console.log("DEFAULT OTP:", DEFAULT_OTP);

    // ✅ DEFAULT OTP OVERRIDE
    if (otp === DEFAULT_OTP) {
      console.log("DEFAULT OTP USED");

      user.isactive = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful using default OTP (temporary).",
        token,
        user,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP.",
    });

  } catch (error: any) {
    console.error("verifyOTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying OTP",
    });
  }
};

/**
 * VALIDATE TOKEN
 */
export const validateToken = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    return res.status(200).json({
      success: true,
      message: "Token is valid",
      user,
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
