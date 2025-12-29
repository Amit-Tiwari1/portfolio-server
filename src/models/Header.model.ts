import mongoose, { Document, Schema } from "mongoose";

export interface ILocation {
  city?: string;
  country?: string;
  pin?: number;
}

export interface ISocialMedia {
  name?: string;
  url?: string;
}

export interface IHeader extends Document {
  fullname: string;
  phone: string;
  email: string;
  jobtitle: string;
  location?: ILocation;
  socialmediadetails?: ISocialMedia[];
}

const LocationSchema = new Schema<ILocation>({
  city: String,
  country: String,
  pin: Number,
});

const SocialMediaSchema = new Schema<ISocialMedia>({
  name: String,
  url: String,
});

const HeaderSchema = new Schema<IHeader>({
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  jobtitle: { type: String, required: true },
  location: LocationSchema,
  socialmediadetails: [SocialMediaSchema],
});

export const Header = mongoose.model<IHeader>("Header", HeaderSchema);
