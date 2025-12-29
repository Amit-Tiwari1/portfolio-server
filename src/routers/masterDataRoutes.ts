import express from "express";
import {
  bulkInsertMasterData,
  createBlogType,
  getAllBlogTypes,
  updateBlogType,
  deleteBlogType,
  createHashtag,
  getAllHashtags,
  updateHashtag,
  deleteHashtag
} from "../controllers/MasterDataController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/bulk", bulkInsertMasterData);
router.post("/blogType", protect, createBlogType);
router.get("/blogTypes", protect, getAllBlogTypes);
router.put("/blogType/:id", protect, updateBlogType);
router.delete("/blogType/:id", protect, deleteBlogType);

router.post("/hashtag", protect, createHashtag);
router.get("/hashtags", protect, getAllHashtags);
router.put("/hashtag/:id", protect, updateHashtag);
router.delete("/hashtag/:id", protect, deleteHashtag);

export default router;
