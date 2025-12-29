import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  upload,
} from "../controllers/ProjectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("projectthumbnail"), createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id",protect, upload.single("projectthumbnail"), updateProject);
router.delete("/:id",protect, deleteProject);

export default router;
