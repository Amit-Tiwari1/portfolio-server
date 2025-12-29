import type { Request, Response } from "express";
import { Project } from "../models/Project.model.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import multer from "multer";
import stream from "stream";

/** ----------------------------
 * 📦 Multer memory storage setup
 * ---------------------------- */
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/** Utility: Safe JSON parse */
const safeParse = (value: any, fallback: any = []) => {
  try {
    return typeof value === "string" ? JSON.parse(value) : value || fallback;
  } catch {
    return fallback;
  }
};

/** Utility: Upload buffer to Cloudinary (TypeScript-safe) */
const uploadToCloudinary = async (buffer: Buffer, folder: string, fileName: string) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);

  return new Promise<string>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder, public_id: fileName, overwrite: true },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || "");
      }
    );
    bufferStream.pipe(upload);
  });
};

/** Utility: Delete Cloudinary file safely */
const deleteFromCloudinary = async (url?: string, folder?: string) => {
  if (!url || !folder) return;
  try {
    const publicId = url.split("/").slice(-1)[0]?.split(".")[0];
    if (publicId) await cloudinary.uploader.destroy(`${folder}/${publicId}`);
  } catch {
    // ignore delete errors
  }
};

/** ----------------------------
 *  📘 CREATE PROJECT
 * ---------------------------- */
export const createProject = async (req: Request, res: Response) => {
  try {
    const { projectname, description, technologiesused, gitHuborliveurl, projectType, tags } =
      req.body;

    let projectthumbnail = "";

    if (req.file) {
      const formattedDate = new Date().toISOString().split("T")[0];
      // Ensure fileName is always string
      const customFileName = `project_${projectname ?? "untitled"}_${formattedDate}`;
      projectthumbnail = await uploadToCloudinary(req.file.buffer, "ProjectThumbnails", customFileName);
    }

    const newProject = new Project({
      projectname,
      description,
      technologiesused: safeParse(technologiesused),
      gitHuborliveurl,
      projectthumbnail,
      projectType,
      tags: safeParse(tags),
    });

    const savedProject = await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: savedProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 GET ALL PROJECTS
 * ---------------------------- */
export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 GET PROJECT BY ID
 * ---------------------------- */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ success: false, message: "Project not found" });

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("❌ Error fetching project by ID:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 UPDATE PROJECT
 * ---------------------------- */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { projectname, description, technologiesused, gitHuborliveurl, projectType, tags } =
      req.body;

    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ success: false, message: "Project not found" });

    let projectthumbnail = project.projectthumbnail;

    if (req.file) {
      await deleteFromCloudinary(project.projectthumbnail!, "ProjectThumbnails");

      const formattedDate = new Date().toISOString().split("T")[0];
      const customFileName = `project_${projectname ?? project.projectname}_${formattedDate}`;
      projectthumbnail = await uploadToCloudinary(req.file.buffer, "ProjectThumbnails", customFileName);
    }

    project.projectname = projectname ?? project.projectname;
    project.description = description ?? project.description;
    project.gitHuborliveurl = gitHuborliveurl ?? project.gitHuborliveurl;
    project.projectType = projectType ?? project.projectType;
    project.projectthumbnail = projectthumbnail!;
    project.technologiesused = safeParse(technologiesused, project.technologiesused);
    project.tags = safeParse(tags, project.tags);

    const updatedProject = await project.save();

    return res.status(200).json({
      success: true,
      message: "✅ Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 DELETE PROJECT
 * ---------------------------- */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ success: false, message: "Project not found" });

    await deleteFromCloudinary(project.projectthumbnail!, "ProjectThumbnails");
    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
