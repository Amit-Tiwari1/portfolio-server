import express from "express";
import {
  createHeader,
  getHeader,
  updateHeader,
  deleteHeader,
} from "../controllers/HeaderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect, createHeader);
router.get("/", getHeader);
router.put("/",protect, updateHeader);
router.delete("/",protect, deleteHeader);

export default router;
