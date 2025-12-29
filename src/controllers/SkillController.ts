import type { Request, Response } from "express";
import { Skill } from "../models/Skill.model.js";

const safeParse = (value: any, fallback: any = []) => {
  try {
    return typeof value === "string" ? JSON.parse(value) : value || fallback;
  } catch {
    return fallback;
  }
};

/* ----------------------------
 *  CREATE SKILL
 * ---------------------------- */
export const createSkill = async (req: Request, res: Response) => {
  try {
    const { mainskillname, workingtimeinyear, subskills } = req.body;

    const parsedSubskills = safeParse(subskills);

    // Validate required field: percentage
    for (const s of parsedSubskills) {
      if (typeof s.percentage !== "number") {
        return res.status(400).json({
          success: false,
          message: "Each subskill must include a percentage field",
        });
      }
    }

    const newSkill = new Skill({
      mainskillname,
      workingtimeinyear,
      subskills: parsedSubskills,
    });

    const savedSkill = await newSkill.save();

    return res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: savedSkill,
    });
  } catch (error) {
    console.error("Error creating skill:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/* ----------------------------
 *  GET ALL SKILLS
 * ---------------------------- */
export const getAllSkills = async (_req: Request, res: Response) => {
  try {
    const skills = await Skill.find().sort({ _id: -1 });
    return res.status(200).json({ success: true, data: skills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/* ----------------------------
 *  GET SKILL BY ID
 * ---------------------------- */
export const getSkillById = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill)
      return res.status(404).json({ success: false, message: "Skill not found" });

    return res.status(200).json({ success: true, data: skill });
  } catch (error) {
    console.error("Error fetching skill:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/* ----------------------------
 *  UPDATE SKILL
 * ---------------------------- */
export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { mainskillname, workingtimeinyear, subskills } = req.body;

    const skill = await Skill.findById(req.params.id);
    if (!skill)
      return res.status(404).json({ success: false, message: "Skill not found" });

    const parsedSubskills = safeParse(subskills, skill.subskills);

    // Validate percentages
    for (const s of parsedSubskills) {
      if (typeof s.percentage !== "number") {
        return res.status(400).json({
          success: false,
          message: "Each subskill must include a percentage field",
        });
      }
    }

    skill.mainskillname = mainskillname ?? skill.mainskillname;
    skill.workingtimeinyear = workingtimeinyear ?? skill.workingtimeinyear;
    skill.subskills = parsedSubskills;

    const updatedSkill = await skill.save();

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: updatedSkill,
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/* ----------------------------
 *  DELETE SKILL
 * ---------------------------- */
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill)
      return res.status(404).json({ success: false, message: "Skill not found" });

    await skill.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
