import express from "express";
import {
  createCertification,
  getAllCertifications,
  updateCertification,
  deleteCertification,
  upload,
} from "../controllers/CertificationController.js";

const router = express.Router();

router.post("/", upload.single("certificateimg"), createCertification);
router.put("/:id", upload.single("certificateimg"), updateCertification);

router.get("/", getAllCertifications);
router.delete("/:id", deleteCertification);

export default router;
