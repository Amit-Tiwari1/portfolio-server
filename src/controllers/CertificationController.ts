import type { Request, Response } from "express";
import { Certification } from "../models/Certification.model.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import multer from "multer";
import stream from "stream";


const storage = multer.memoryStorage();
export const upload = multer({ storage });


const getPublicIdFromUrl = (url: string): string | null => {
  if (!url) return null;
  const parts = url.split("/");
  const fileName = parts.pop();
  const folder = parts.pop();
  if (!fileName || !folder) return null;
  return `${folder}/${fileName.split(".")[0]}`;
};


export const createCertification = async (req: Request, res: Response) => {
  try {
    const { certificatename, startdate, institutionname, description } = req.body;

    let certificateimg = "";

    if (req.file) {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      const uploadPromise = new Promise<string>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          {
            folder: "CertificateImages",
            public_id: `certificate_${Date.now()}`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || "");
          }
        );
        bufferStream.pipe(upload);
      });

      certificateimg = await uploadPromise;
    }

    const newCert = new Certification({
      certificatename,
      startdate,
      institutionname,
      description,
      certificateimg,
    });

    const savedCert = await newCert.save();

    return res.status(201).json({
      success: true,
      message: "Certification created successfully",
      data: savedCert,
    });
  } catch (error) {
    console.error("Error creating certification:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};


export const getAllCertifications = async (_req: Request, res: Response) => {
  try {
    const certs = await Certification.find().sort({ _id: -1 });
    return res.status(200).json({ success: true, data: certs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/* ---------------- UPDATE ---------------- */
export const updateCertification = async (req: Request, res: Response) => {
  try {
    const { certificatename, startdate, institutionname, description } = req.body;

    const cert = await Certification.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: "Certification not found" });
    }

    let certificateimg = cert.certificateimg;

    if (req.file) {
      // delete old image
      if (cert.certificateimg) {
        const publicId = getPublicIdFromUrl(cert.certificateimg);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId).catch(() => {});
        }
      }

      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      const uploadPromise = new Promise<string>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "CertificateImages" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || "");
          }
        );
        bufferStream.pipe(upload);
      });

      certificateimg = await uploadPromise;
    }

    cert.certificatename = certificatename ?? cert.certificatename;
    cert.startdate = startdate ?? cert.startdate;
    cert.institutionname = institutionname ?? cert.institutionname;
    cert.description = description ?? cert.description;
    if (req.file) {
  cert.certificateimg = certificateimg!;
}

    const updatedCert = await cert.save();

    return res.status(200).json({
      success: true,
      message: "Certification updated successfully",
      data: updatedCert,
    });
  } catch (error) {
    console.error("Error updating certification:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/* ---------------- DELETE ---------------- */
export const deleteCertification = async (req: Request, res: Response) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: "Certification not found" });
    }

    if (cert.certificateimg) {
      const publicId = getPublicIdFromUrl(cert.certificateimg);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    await cert.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Certification deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
