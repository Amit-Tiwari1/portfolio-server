import type { Request, Response } from "express";
import { BlogType } from "../models/BlogTypes.model.js";
import { Hashtag } from "../models/Hashtags.model.js";


export const bulkInsertMasterData = async (_req: Request, res: Response) => {
  try {
    const blogTypes = [
      "Interview Questions", "React", "JavaScript", "TypeScript", "Node.js",
      "Express", "WebSocket", "Next.js", "JWT", "bcrypt", "Notes", "Others",
      "DevOps", "Docker", "Kubernetes", "CI/CD", "AWS", "GCP",
      "Blockchain", "Web3", "Smart Contracts", "Solidity", "Ethereum", "Debugging", "DSA"
    ];

    const hashtags = [
      { name: "#ReactJS", description: "React-related posts and notes" },
      { name: "#NodeJS", description: "Node.js backend tricks" },
      { name: "#DevOps", description: "Docker, CI/CD, deployment, etc." },
      { name: "#Web3", description: "Blockchain and decentralized apps" },
      { name: "#JavaScript", description: "Frontend and backend scripting" },
      { name: "#Interview", description: "Common interview questions and answers" }
    ];

    // Avoid duplicates if already inserted
    const existingTypes = await BlogType.countDocuments();
    const existingTags = await Hashtag.countDocuments();

    if (existingTypes === 0) await BlogType.insertMany(blogTypes.map(name => ({ name })));
    if (existingTags === 0) await Hashtag.insertMany(hashtags);

    res.status(201).json({
      success: true,
      message: "Master data inserted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const createBlogType = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const blogType = await BlogType.create({ name });
    res.status(201).json({ success: true, data: blogType });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBlogTypes = async (_req: Request, res: Response) => {
  try {
    const blogTypes = await BlogType.find();
    res.json({ success: true, data: blogTypes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBlogType = async (req: Request, res: Response) => {
  try {
    const updated = await BlogType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlogType = async (req: Request, res: Response) => {
  try {
    await BlogType.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Blog type deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const createHashtag = async (req: Request, res: Response) => {
  try {
    const hashtag = await Hashtag.create(req.body);
    res.status(201).json({ success: true, data: hashtag });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllHashtags = async (_req: Request, res: Response) => {
  try {
    const hashtags = await Hashtag.find();
    res.json({ success: true, data: hashtags });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHashtag = async (req: Request, res: Response) => {
  try {
    const updated = await Hashtag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHashtag = async (req: Request, res: Response) => {
  try {
    await Hashtag.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Hashtag deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
