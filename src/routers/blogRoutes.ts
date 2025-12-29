import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  upload,
} from "../controllers/BlogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("thumbnail"), createBlog);
router.put("/:id", protect, upload.single("thumbnail"), updateBlog);
router.delete("/:id", protect, deleteBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

export default router;
