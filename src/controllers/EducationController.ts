import type { Request, Response } from "express";
import { Education } from "../models/Education.model.js";

/** ----------------------------
 *  📘 CREATE EDUCATION
 * ---------------------------- */
export const createEducation = async (req: Request, res: Response) => {
  try {
    const { degreename, institution, duration, percentageorCGPA, relevantcoursework } = req.body;

    const newEducation = new Education({
      degreename,
      institution,
      duration,
      percentageorCGPA,
      relevantcoursework,
    });

    const savedEducation = await newEducation.save();

    return res.status(201).json({
      success: true,
      message: "Education created successfully",
      data: savedEducation,
    });
  } catch (error) {
    console.error("Error creating education:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 GET ALL EDUCATIONS
 * ---------------------------- */
export const getAllEducations = async (_req: Request, res: Response) => {
  try {
    const educations = await Education.find().sort({ _id: -1 });
    return res.status(200).json({ success: true, data: educations });
  } catch (error) {
    console.error("Error fetching educations:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 GET EDUCATION BY ID
 * ---------------------------- */
export const getEducationById = async (req: Request, res: Response) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education)
      return res.status(404).json({ success: false, message: "Education not found" });

    return res.status(200).json({ success: true, data: education });
  } catch (error) {
    console.error("Error fetching education:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 UPDATE EDUCATION
 * ---------------------------- */
export const updateEducation = async (req: Request, res: Response) => {
  try {
    const { degreename, institution, duration, percentageorCGPA, relevantcoursework } = req.body;

    const education = await Education.findById(req.params.id);
    if (!education)
      return res.status(404).json({ success: false, message: "Education not found" });

    education.degreename = degreename ?? education.degreename;
    education.institution = institution ?? education.institution;
    education.duration = duration ?? education.duration;
    education.percentageorCGPA = percentageorCGPA ?? education.percentageorCGPA;
    education.relevantcoursework = relevantcoursework ?? education.relevantcoursework;

    const updatedEducation = await education.save();

    return res.status(200).json({
      success: true,
      message: "Education updated successfully",
      data: updatedEducation,
    });
  } catch (error) {
    console.error("Error updating education:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 DELETE EDUCATION
 * ---------------------------- */
export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education)
      return res.status(404).json({ success: false, message: "Education not found" });

    await education.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting education:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
