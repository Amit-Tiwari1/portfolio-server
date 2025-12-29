import mongoose, { Schema, Document, model } from "mongoose";

export interface IBlogType extends Document {
  name: string;
}

const BlogTypeSchema = new Schema<IBlogType>({
  name: { type: String, required: true },
});

export const BlogType = model<IBlogType>("BlogType", BlogTypeSchema);
