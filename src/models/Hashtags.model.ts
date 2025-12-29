import mongoose, { Schema, Document, model } from "mongoose";

export interface IHashtag extends Document {
  name: string;
  description: string;
}

const HashtagSchema = new Schema<IHashtag>({
  name: { type: String, required: true },
  description: { type: String, required: false },
});

export const Hashtag = model<IHashtag>("Hashtag", HashtagSchema);
