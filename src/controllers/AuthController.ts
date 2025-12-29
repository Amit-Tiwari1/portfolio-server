import type { Request, Response } from "express";
import { User } from "../models/allmodels.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { gmail } = req.body;
    if (!gmail)
      return res.status(400).json({ success: false, message: "Email is required." });

    const user = await User.findOne({ gmail });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const mailOptions = {
      from: `"Portfolio Admin" <${process.env.GMAIL_USER}>`,
      to: gmail,
      subject: "Your OTP for Admin Login",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f6f8fa;">
          <h2 style="color:#333;">Portfolio Admin Login</h2>
          <p>Your OTP for login is:</p>
          <h1 style="letter-spacing: 5px; color: #007bff;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
          <p style="color:#555;">If you didn’t request this, you can ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${gmail}.`,
    });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ success: false, message: "Error sending OTP", error: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { gmail, otp } = req.body;

    if (!gmail || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required." });

    const user = await User.findOne({ gmail });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or invalid." });
    }

    if (user.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect OTP." });
    }

    user.isactive = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Error verifying OTP", error: error.message });
  }
};
export const validateToken = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    res.status(200).json({
      success: true,
      message: "Token is valid",
      user,
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

