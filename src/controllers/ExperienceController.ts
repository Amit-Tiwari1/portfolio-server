import type { Request, Response } from "express";
import { Experience } from "../models/Experience.model.js";

/** ----------------------------
 *  📘 CREATE EXPERIENCE
 * ---------------------------- */
export const createExperience = async (req: Request, res: Response) => {
  try {
    const {
      jobtitle,
      companyname,
      startdate,
      enddate,
      location,
      jobtype,
      responsibilities,
      achievements,
    } = req.body;

    const newExperience = new Experience({
      jobtitle,
      companyname,
      startdate,
      enddate,
      location,
      jobtype,
      responsibilities,
      achievements,
    });

    const savedExperience = await newExperience.save();

    return res.status(201).json({
      success: true,
      message: "Experience created successfully",
      data: savedExperience,
    });
  } catch (error) {
    console.error("Error creating experience:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 GET ALL EXPERIENCES
 * ---------------------------- */
export const getAllExperiences = async (_req: Request, res: Response) => {
  try {
    const experiences = await Experience.find().sort({ startdate: -1 });
    return res.status(200).json({ success: true, data: experiences });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 GET EXPERIENCE BY ID
 * ---------------------------- */
export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ success: false, message: "Experience not found" });

    return res.status(200).json({ success: true, data: experience });
  } catch (error) {
    console.error("Error fetching experience:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 UPDATE EXPERIENCE
 * ---------------------------- */
export const updateExperience = async (req: Request, res: Response) => {
  try {
    const {
      jobtitle,
      companyname,
      startdate,
      enddate,
      location,
      jobtype,
      responsibilities,
      achievements,
    } = req.body;

    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ success: false, message: "Experience not found" });

    experience.jobtitle = jobtitle ?? experience.jobtitle;
    experience.companyname = companyname ?? experience.companyname;
    experience.startdate = startdate ?? experience.startdate;
    experience.enddate = enddate ?? experience.enddate;
    experience.location = location ?? experience.location;
    experience.jobtype = jobtype ?? experience.jobtype;
    experience.responsibilities = responsibilities ?? experience.responsibilities;
    experience.achievements = achievements ?? experience.achievements;

    const updatedExperience = await experience.save();

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      data: updatedExperience,
    });
  } catch (error) {
    console.error("Error updating experience:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 DELETE EXPERIENCE
 * ---------------------------- */
export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ success: false, message: "Experience not found" });

    await experience.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
