import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICV extends Document {
  headers: Types.ObjectId;
  professional_summary: string;
  skills?: Types.ObjectId[];
  experience?: Types.ObjectId[];
  projects?: Types.ObjectId[];
  education?: Types.ObjectId[];
  certifications_achievements?: Types.ObjectId[];
  languages?: string[];
  interests?: string[];
  role?: string;
  mainCV?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CVSchema = new Schema<ICV>(
  {
    headers: { type: Schema.Types.ObjectId, ref: "Header", required: true },
    professional_summary: { type: String, required: true },
    skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    experience: [{ type: Schema.Types.ObjectId, ref: "Experience" }],
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    education: [{ type: Schema.Types.ObjectId, ref: "Education" }],
    certifications_achievements: [{ type: Schema.Types.ObjectId, ref: "Certification" }],
    languages: [String],
    interests: [String],
    role: { type: String },
    mainCV: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CV = mongoose.model<ICV>("CV", CVSchema);
