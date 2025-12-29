import express from "express";
import {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
} from "../controllers/ExperienceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect, createExperience);
router.get("/", getAllExperiences);
router.get("/:id", getExperienceById);
router.put("/:id",protect, updateExperience);
router.delete("/:id",protect, deleteExperience);

export default router;
