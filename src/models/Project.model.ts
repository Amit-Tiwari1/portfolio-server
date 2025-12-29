import mongoose, { Document, Schema } from "mongoose";

export interface ITechnology {
  techname: string;
  usedfor: string;
}

export interface IProject extends Document {
  projectname: string;
  description: string;
  technologiesused?: ITechnology[];
  gitHuborliveurl: string;
  projectthumbnail?: string | null;
  projectType?: mongoose.Types.ObjectId; 
  tags?: mongoose.Types.ObjectId[]; 
}

const TechnologySchema = new Schema<ITechnology>({
  techname: { type: String, required: true },
  usedfor: { type: String, required: true },
});

const ProjectSchema = new Schema<IProject>(
  {
    projectname: { type: String, required: true },
    description: { type: String, required: true },
    technologiesused: [TechnologySchema],
    gitHuborliveurl: { type: String, required: true },
    projectthumbnail: { type: String, default: null },
    projectType: { type: mongoose.Schema.Types.ObjectId, ref: "BlogType" },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hashtag" }],
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
