import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createProfileSummary,
  getAllProfileSummaries,
  getProfileSummaryByRole,
  updateProfileSummary,
  deleteProfileSummary,
} from "../controllers/profileSummaryController.js";

const router = express.Router();

router.get("/role/:role", getProfileSummaryByRole);
router.post("/", protect,createProfileSummary);
router.get("/", getAllProfileSummaries);
router.put("/:id", updateProfileSummary);
router.delete("/:id", deleteProfileSummary);

export default router;
