import mongoose, { Schema, Document } from "mongoose";

export interface IProfileSummary extends Document {
  role: string;
  summary: string;
}

const ProfileSummarySchema = new Schema<IProfileSummary>(
  {
    role: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const ProfileSummary = mongoose.model<IProfileSummary>(
  "ProfileSummary",
  ProfileSummarySchema
);

export default ProfileSummary;
