import type { Request, Response } from "express";
import { Header } from "../models/Header.model.js";

/** ----------------------------
 *  📘 CREATE HEADER
 * ---------------------------- */
export const createHeader = async (req: Request, res: Response) => {
  try {
    const { fullname, phone, email, jobtitle, location, socialmediadetails } = req.body;

    const newHeader = new Header({
      fullname,
      phone,
      email,
      jobtitle,
      location,
      socialmediadetails,
    });

    const savedHeader = await newHeader.save();

    return res.status(201).json({
      success: true,
      message: "Header created successfully",
      data: savedHeader,
    });
  } catch (error) {
    console.error("Error creating header:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 GET HEADER
 * ---------------------------- */
export const getHeader = async (_req: Request, res: Response) => {
  try {
    // Assuming only one header document exists
    const header = await Header.findOne();
    return res.status(200).json({ success: true, data: header });
  } catch (error) {
    console.error("Error fetching header:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 UPDATE HEADER
 * ---------------------------- */
export const updateHeader = async (req: Request, res: Response) => {
  try {
    const { fullname, phone, email, jobtitle, location, socialmediadetails } = req.body;

    const header = await Header.findOne();
    if (!header) return res.status(404).json({ success: false, message: "Header not found" });

    header.fullname = fullname ?? header.fullname;
    header.phone = phone ?? header.phone;
    header.email = email ?? header.email;
    header.jobtitle = jobtitle ?? header.jobtitle;
    header.location = location ?? header.location;
    header.socialmediadetails = socialmediadetails ?? header.socialmediadetails;

    const updatedHeader = await header.save();

    return res.status(200).json({
      success: true,
      message: "Header updated successfully",
      data: updatedHeader,
    });
  } catch (error) {
    console.error("Error updating header:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/** ----------------------------
 *  📘 DELETE HEADER
 * ---------------------------- */
export const deleteHeader = async (_req: Request, res: Response) => {
  try {
    const header = await Header.findOne();
    if (!header) return res.status(404).json({ success: false, message: "Header not found" });

    await header.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Header deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting header:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
