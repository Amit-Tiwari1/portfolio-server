import express from "express";
import {
  createEducation,
  getAllEducations,
  getEducationById,
  updateEducation,
  deleteEducation,
} from "../controllers/EducationController.js";

const router = express.Router();

router.post("/", createEducation);

router.get("/", getAllEducations);

router.get("/:id", getEducationById);

router.put("/:id", updateEducation);

router.delete("/:id", deleteEducation);

export default router;
