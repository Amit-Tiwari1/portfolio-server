import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  generateAndSaveCV,
  getAllCVs,
  updateCV,
  deleteCV,
  downloadMainCV,
  downloadCVById,
} from "../controllers/CVController.js";

const router = express.Router();

/* ===============================
   PUBLIC ROUTE (Landing Page)
================================ */
// Download MAIN CV (public)
router.get("/download", downloadMainCV);

/* ===============================
   PROTECTED ROUTES (Dashboard)
================================ */
router.use(protect);

// Create CV
router.post("/generate", generateAndSaveCV);

// Get all CVs
router.get("/", getAllCVs);

// Update CV
router.put("/:id", updateCV);

// Delete CV
router.delete("/:id", deleteCV);

// Download CV by ID
router.get("/download/:id", downloadCVById);

export default router;
