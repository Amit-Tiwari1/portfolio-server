import mongoose, { Document, Schema } from "mongoose";

export interface ISubSkill {
  subskillname: string;
  percentage: number;
  subskillcategories?: { subskillcategoryname: string }[];
}

export interface ISkill extends Document {
  mainskillname: string;
  rating: number;
  workingtimeinyear?: string;
  subskills?: ISubSkill[];
}

const SubSkillSchema = new Schema<ISubSkill>({
  subskillname: { type: String, required: true },
  percentage: { type: Number, required: true },
  subskillcategories: [{ subskillcategoryname: String }],
});

const SkillSchema = new Schema<ISkill>({
  mainskillname: { type: String, required: true },
  workingtimeinyear: String,
  subskills: [SubSkillSchema],
});

export const Skill = mongoose.model<ISkill>("Skill", SkillSchema);
