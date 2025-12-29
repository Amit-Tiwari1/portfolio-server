import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IBlog extends Document {
  thumbnail?: string;
  type: Types.ObjectId;
  hashtags: Types.ObjectId[];
  title: string;
  content: string;
  code?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    thumbnail: { type: String, required: false },
    type: { type: Schema.Types.ObjectId, ref: "BlogType", required: true },
    hashtags: [{ type: Schema.Types.ObjectId, ref: "Hashtag" }],
    title: { type: String, required: true },
    content: { type: String, required: true },
    code: { type: String, required: false },
  },
  { timestamps: true }
);

export const BlogModel = model<IBlog>("Blog", BlogSchema);
