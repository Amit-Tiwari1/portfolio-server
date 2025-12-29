import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  number: string;
  gmail: string;
  password: string;
  isactive: boolean;
  otp?: string | undefined;
  otpExpires?: Date | undefined;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  number: { type: String, required: true },
  gmail: { type: String, required: true },
  password: { type: String, required: true },
  isactive: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
});

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
