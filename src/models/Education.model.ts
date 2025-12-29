import mongoose, { Document, Schema } from "mongoose";

export interface IEducation extends Document {
  degreename: string;
  institution: string;
  duration: string;
  percentageorCGPA?: string;
  relevantcoursework?: string;
}

const EducationSchema = new Schema<IEducation>({
  degreename: { type: String, required: true },
  institution: { type: String, required: true },
  duration: { type: String, required: true },
  percentageorCGPA: String,
  relevantcoursework: String,
});

export const Education = mongoose.model<IEducation>("Education", EducationSchema);
