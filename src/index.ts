import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routers/userRoutes.js";
import authRoutes from "./routers/authRoutes.js";
import masterDataRoutes from "./routers/masterDataRoutes.js";
import blogRoutes from "./routers/blogRoutes.js";
import projectRoutes from "./routers/projectRoutes.js";
import skillRoutes from "./routers/skillRoutes.js";
import certificationRoutes from "./routers/certificationRoutes.js";
import educationRoutes from "./routers/educationRoutes.js";
import experienceRoutes from "./routers/experienceRoutes.js";
import headerRoutes from "./routers/headerRoutes.js";
import cvRoutes from "./routers/cvRoutes.js";
import profileSummaryRoutes from "./routers/profileSummaryRoutes.js"
import cors from "cors"
import "dotenv/config";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/master", masterDataRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/educations", educationRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/header", headerRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/profile-summary", profileSummaryRoutes);





app.get("/", (req, res) => {
  res.send("Server working");
});

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
