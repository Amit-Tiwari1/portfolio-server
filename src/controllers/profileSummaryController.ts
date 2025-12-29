import type { Request, Response } from "express";
import ProfileSummary from "../models/profileSummary.model.js";

export const createProfileSummary = async (req: Request, res: Response) => {
  try {
    const { role, summary } = req.body;

    if (!role || !summary) {
      return res.status(400).json({
        success: false,
        message: "Role and summary are required",
      });
    }

    const exists = await ProfileSummary.findOne({ role });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Profile summary already exists for this role",
      });
    }

    const profileSummary = await ProfileSummary.create({
      role,
      summary,
    });

    res.status(201).json({
      success: true,
      message: "Profile summary created",
      data: profileSummary,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ---------------- GET ALL ---------------- */
export const getAllProfileSummaries = async (_: Request, res: Response) => {
  try {
    const summaries = await ProfileSummary.find().sort({ role: 1 }).lean();

    res.status(200).json({
      success: true,
      data: summaries,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ---------------- GET BY ROLE ---------------- */
export const getProfileSummaryByRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;

    const summary = await ProfileSummary.findOne({ role }).lean();

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: "Profile summary not found for this role",
      });
    }

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ---------------- UPDATE ---------------- */
export const updateProfileSummary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { summary } = req.body;

    const updated = await ProfileSummary.findByIdAndUpdate(
      id,
      { summary },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Profile summary not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile summary updated",
      data: updated,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ---------------- DELETE ---------------- */
export const deleteProfileSummary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await ProfileSummary.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Profile summary not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile summary deleted",
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
