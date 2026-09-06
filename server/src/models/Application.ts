import { Schema, model, Document, Types } from "mongoose";

export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";

export interface IApplication extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  projectTitle: string; // denormalized, same reasoning as Project.ownerName

  applicant: Types.ObjectId;
  applicantName: string;
  applicantUniversity: string;

  // The project's owner, copied at application time. This is what makes
  // "applications received" a single indexed query (ownerId: req.userId)
  // instead of a two-step "find my projects, then find applications for
  // those project ids" lookup.
  ownerId: Types.ObjectId;

  message: string;
  relevantSkills: string[];
  expectedContribution: string;
  availability: string;
  status: ApplicationStatus;

  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    projectTitle: { type: String, required: true },

    applicant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    applicantName: { type: String, required: true },
    applicantUniversity: { type: String, required: true },

    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    message: { type: String, required: true, trim: true, minlength: 20 },
    relevantSkills: { type: [String], required: true, validate: (v: string[]) => v.length > 0 },
    expectedContribution: { type: String, required: true, trim: true, minlength: 10 },
    availability: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

// One application per (project, applicant) pair — applying twice to the
// same project shouldn't create a second row, it should be rejected.
applicationSchema.index({ project: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ ownerId: 1, status: 1 });
applicationSchema.index({ applicant: 1 });

export const Application = model<IApplication>("Application", applicationSchema);
