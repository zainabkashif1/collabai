import { Schema, model, Document, Types } from "mongoose";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ProjectStatus = "Open" | "In Progress" | "Completed";

export interface IProject extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  difficulty: Difficulty;
  durationWeeks: number;
  teamSize: number;
  status: ProjectStatus;
  remote: boolean;

  owner: Types.ObjectId; // real reference — used for authorization (only the owner can edit/manage applications)
  ownerName: string; // denormalized snapshot — avoids a populate() on every list/detail read
  ownerUniversity: string;

  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true, minlength: 4 },
    description: { type: String, required: true, trim: true, minlength: 20 },
    category: { type: String, required: true },
    requiredSkills: { type: [String], required: true, validate: (v: string[]) => v.length > 0 },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    durationWeeks: { type: Number, required: true, min: 1, max: 52 },
    teamSize: { type: Number, required: true, min: 1, max: 20 },
    status: { type: String, enum: ["Open", "In Progress", "Completed"], default: "Open" },
    remote: { type: Boolean, default: true },

    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ownerName: { type: String, required: true },
    ownerUniversity: { type: String, required: true },
  },
  { timestamps: true }
);

// Discovery filters by category/difficulty/remote and searches by title
// constantly (see project.controller.ts) — indexing the fields actually
// queried on keeps that fast as the collection grows past mock-data size.
projectSchema.index({ category: 1, difficulty: 1, remote: 1 });
projectSchema.index({ title: "text" });

export const Project = model<IProject>("Project", projectSchema);
