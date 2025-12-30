import type { Request, Response } from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

import { createCVHTML } from "../templates/CVTemplate.js";
import { Header, CV } from "../models/allmodels.js";


export const generateAndSaveCV = async (req: Request, res: Response) => {
  try {
    const {
      professional_summary,
      role,
      mainCV,
      skillIds = [],
      experienceIds = [],
      projectIds = [],
      educationIds = [],
      certificationIds = [],
      languages = [],
      interests = [],
    } = req.body;

    const header = await Header.findOne();
    if (!header) {
      return res.status(404).json({
        success: false,
        message: "Header profile not found",
      });
    }

    // ❗ Prevent duplicate main CV
    if (mainCV) {
      const existingMain = await CV.findOne({ mainCV: true });
      if (existingMain) {
        return res.status(400).json({
          success: false,
          message: "Main CV already exists. Please update it instead.",
        });
      }
    }

    const cv = new CV({
      headers: header._id,
      professional_summary,
      role,
      mainCV: !!mainCV,
      skills: skillIds,
      experience: experienceIds,
      projects: projectIds,
      education: educationIds,
      certifications_achievements: certificationIds,
      languages,
      interests,
    });

    await cv.save();

    return res.status(201).json({
      success: true,
      message: "CV created successfully",
      data: cv,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create CV",
      error: error.message,
    });
  }
};


export const getAllCVs = async (_req: Request, res: Response) => {
  try {
    const cvs = await CV.find()
      .populate(
        "headers skills experience projects education certifications_achievements"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: cvs,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch CVs",
      error: error.message,
    });
  }
};


export const updateCV = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      professional_summary,
      role,
      mainCV,
      skillIds,
      experienceIds,
      projectIds,
      educationIds,
      certificationIds,
      languages,
      interests,
    } = req.body;
    if (mainCV) {
      await CV.updateMany(
        { _id: { $ne: id }, mainCV: true },
        { mainCV: false }
      );
    }

    const updatedCV = await CV.findByIdAndUpdate(
      id,
      {
        professional_summary,
        role,
        mainCV: !!mainCV,
        skills: skillIds,
        experience: experienceIds,
        projects: projectIds,
        education: educationIds,
        certifications_achievements: certificationIds,
        languages,
        interests,
      },
      { new: true }
    );

    if (!updatedCV) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "CV updated successfully",
      data: updatedCV,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update CV",
      error: error.message,
    });
  }
};


export const deleteCV = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await CV.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "CV deleted successfully",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete CV",
      error: error.message,
    });
  }
};


export const downloadMainCV = async (_req: Request, res: Response) => {
  try {
    const cv = await CV.findOne({ mainCV: true })
      .populate(
        "headers skills experience projects education certifications_achievements"
      )
      .lean();

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "Main CV not found",
      });
    }

    await generatePDF(cv, res);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to download CV",
      error: error.message,
    });
  }
};


export const downloadCVById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cv = await CV.findById(id)
      .populate(
        "headers skills experience projects education certifications_achievements"
      )
      .lean();

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    await generatePDF(cv, res);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to download CV",
      error: error.message,
    });
  }
};


const generatePDF = async (cv: any, res: Response) => {
  const html = createCVHTML({
    header: cv.headers,
    professional_summary: cv.professional_summary,
    skills: cv.skills,
    experience: cv.experience,
    projects: cv.projects,
    education: cv.education,
    certifications: cv.certifications_achievements,
    languages: cv.languages,
  });

const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: true,
});


  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.emulateMediaType("screen");

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "8mm",
      bottom: "8mm",
      left: "8mm",
      right: "8mm",
    },
  });

  await browser.close();

  const safeName = cv.headers.fullname.replace(/\s+/g, "_");

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename=${safeName}_CV.pdf`,
    "Content-Length": Buffer.byteLength(pdfBuffer),
  });

  return res.send(pdfBuffer);
};



