import type { Request, Response } from "express";
import { User } from "../models/allmodels.js";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();


export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { gmail } = req.body;

    if (!gmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ gmail });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); 

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

  
    await resend.emails.send({
      from: "Portfolio Admin <onboarding@resend.dev>",
      to: gmail,
      subject: "Your OTP for Admin Login",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Portfolio Admin Login</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
          <p>If you didn’t request this, you can ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${gmail}.`,
    });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
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

    if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or invalid.",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP.",
      });
    }


    user.isactive = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};


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
