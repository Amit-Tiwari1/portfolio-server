import mongoose, { Document, Schema } from "mongoose";

export interface IExperience extends Document {
  jobtitle: string;
  companyname: string;
  companyWebsiteLink:string
  startdate: string;
  enddate: string;
  location: string;
  jobtype: "Remote" | "WFH" | "Client Location" | "WFO";
  responsibilities: string;
  achievements?: string;
}

const ExperienceSchema = new Schema<IExperience>({
  jobtitle: { type: String, required: true },
  companyname: { type: String, required: true },
  companyWebsiteLink:{type:String, required:false},
  startdate: { type: String, required: true },
  enddate: { type: String, required: true },
  location: { type: String, required: true },
  jobtype: { 
    type: String, 
    enum: ["Remote", "WFH", "Client Location", "WFO"], 
    required: true 
  },
  responsibilities: { type: String, required: true },
  achievements: String,
});

export const Experience = mongoose.model<IExperience>("Experience", ExperienceSchema);
