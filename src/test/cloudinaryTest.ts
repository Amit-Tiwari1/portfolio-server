import cloudinary from "../utils/cloudinaryConfig.js";
import path from "path";

async function testUpload() {
  try {
    const filePath = path.resolve("/Users/amitkumartiwari/Documents/Projects/portfilio/portfolio/src/assets/Final-logo.png"); // <- place any image here
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "portfolio_thumbnails", // optional folder name
    });
    console.log("✅ Upload success:", result.secure_url);
  } catch (error: any) {
    console.error("❌ Upload failed:", error.message);
  }
}

testUpload();
