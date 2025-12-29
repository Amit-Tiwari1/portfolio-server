import express from "express";
import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from "../controllers/SkillController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSkill);

router.get("/", getAllSkills);

router.get("/:id", getSkillById);

router.put("/:id",protect, updateSkill);

router.delete("/:id",protect, deleteSkill);

export default router;
