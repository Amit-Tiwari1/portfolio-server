import mongoose, { Document, Schema } from "mongoose";

export interface ICertification extends Document {
  certificatename?: string;
  startdate?: string;
  institutionname?: string;
  description?: string;
  certificateimg?:string
}

const CertificationSchema = new Schema<ICertification>(
  {
    certificatename: { type: String, required: true, trim: true },
    startdate: { type: String, required: true },
    institutionname: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    certificateimg: {
  type: String,
  required: false,
},
  },
  { timestamps: true }
);

export const Certification = mongoose.model<ICertification>("Certification", CertificationSchema);
