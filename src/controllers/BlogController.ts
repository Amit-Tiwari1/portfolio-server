import type { Request, Response } from "express";
import mongoose from "mongoose";
import { BlogModel } from "../models/Blog.model.js";
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
  const publicId = `${folder}/${fileName.split(".")[0]}`;
  return publicId;
};

/**
 * Convert string(s) to ObjectId(s)
 */
const toObjectIds = (input: any): mongoose.Types.ObjectId[] => {
  if (!input) return [];
  try {
    const parsed = typeof input === "string" ? JSON.parse(input) : input;
    return Array.isArray(parsed)
      ? parsed.map((id: string) => new mongoose.Types.ObjectId(id))
      : [new mongoose.Types.ObjectId(parsed)];
  } catch {
    return [new mongoose.Types.ObjectId(input)];
  }
};

/**
 * CREATE BLOG
 */
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, type, hashtags, code } = req.body;
    let thumbnailUrl = "";

    const convertedType = new mongoose.Types.ObjectId(type);
    const convertedHashtags = toObjectIds(hashtags);

    if (req.file) {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      const formattedDate = new Date().toISOString().split("T")[0];
      const customFileName = `blog_${formattedDate}_${Date.now()}`;

      const uploadPromise = new Promise<string>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          {
            folder: "BlogImages",
            public_id: customFileName,
            overwrite: true,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || "");
          }
        );
        bufferStream.pipe(upload);
      });

      thumbnailUrl = await uploadPromise;
    }

    const newBlog = new BlogModel({
      thumbnail: thumbnailUrl,
      title,
      content,
      type: convertedType,
      hashtags: convertedHashtags,
      code,
    });

    const savedBlog = await newBlog.save();
    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: savedBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

/**
 * GET ALL BLOGS
 */
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await BlogModel.find()
      .populate("type")
      .populate("hashtags")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

/**
 * GET BLOG BY ID
 */
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blog = await BlogModel.findById(req.params.id)
      .populate("type")
      .populate("hashtags");
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

/**
 * UPDATE BLOG
 */
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, type, hashtags, code } = req.body;
    const blog = await BlogModel.findById(req.params.id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    // Convert fields
    const convertedType = type ? new mongoose.Types.ObjectId(type) : blog.type;
    const convertedHashtags = hashtags ? toObjectIds(hashtags) : blog.hashtags;

    let thumbnailUrl = blog.thumbnail;

    // If new thumbnail uploaded
    if (req.file) {
      // Delete old thumbnail from Cloudinary
      if (blog.thumbnail) {
        const oldPublicId = getPublicIdFromUrl(blog.thumbnail);
        if (oldPublicId) {
          await cloudinary.uploader.destroy(oldPublicId).catch(() => {});
        }
      }

      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      const uploadPromise = new Promise<string>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "BlogImages" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || "");
          }
        );
        bufferStream.pipe(upload);
      });

      thumbnailUrl = await uploadPromise;
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.type = convertedType;
    blog.hashtags = convertedHashtags;
    blog.code = code || blog.code;
    blog.thumbnail = thumbnailUrl!;

    const updatedBlog = await blog.save();
    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

/**
 * DELETE BLOG
 */
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    // Delete Cloudinary image if exists
    if (blog.thumbnail) {
      const publicId = getPublicIdFromUrl(blog.thumbnail);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    await blog.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};
