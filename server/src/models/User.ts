import { Schema, model, Document, Types } from "mongoose";

export type ProficiencyLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Skill {
  name: string;
  profilePicture?: string;
  proficiency: ProficiencyLevel;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  university: string;
  degreeProgram: string;
  graduationYear: number;

  // Profile fields (SRS §8) — extending User rather than a separate
  // Profile collection, since it's a strict 1:1 relationship. All
  // optional because they're filled in after registration, not at it.
  semester?: string;
  country?: string;
  city?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  availability?: string;
  preferredTeamSize?: number;
  preferredRole?: string;
  interests: string[];
  preferredCategories: string[];
  skills: Skill[];

  isEmailVerified: boolean;
  emailVerificationTokenHash?: string;
  emailVerificationExpires?: Date;

  passwordResetTokenHash?: string;
  passwordResetExpires?: Date;

  refreshTokenHash?: string;

  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<Skill>(
  {
    name: { type: String, required: true, trim: true },
    profilePicture: { type: String, maxlength: 3_000_000 },
    proficiency: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      required: true,
    },
  },
  { _id: false } // skills don't need their own id — they're only ever read/written as part of the user doc
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    university: { type: String, required: true, trim: true },
    degreeProgram: { type: String, required: true, trim: true },
    graduationYear: { type: Number, required: true },

    semester: { type: String, trim: true },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: 300 },
    githubUrl: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    availability: { type: String, trim: true, maxlength: 200 },
    preferredTeamSize: { type: Number, min: 1, max: 20 },
    preferredRole: { type: String, trim: true },
    interests: { type: [String], default: [] },
    preferredCategories: { type: [String], default: [] },
    skills: { type: [skillSchema], default: [] },

    isEmailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },

    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    refreshTokenHash: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.path("passwordHash").select(false);

export const User = model<IUser>("User", userSchema);
