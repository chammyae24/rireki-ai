import { z } from "zod";

const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const familyDetailSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  age: z.any().transform((val) => Number(val)),
  occupation: z.string().min(1, "Occupation is required"),
});

const physicalStatsSchema = z.object({
  heightCm: z.any().transform((val) => Number(val)),
  weightKg: z.any().transform((val) => Number(val)),
  bloodType: z.string().optional(),
  handz: z.enum(["Right", "Left"]),
});
export const resumeSchema = z.object({
  tier: z.enum(["TITP", "SSW", "ENGINEER"]),
  personalInfo: z.object({
    fullName: z.string().min(1, "Full name is required"),
    katakanaName: z.string().min(1, "Katakana name is required"),
    gender: z.enum(["Male", "Female"]),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    currentAddress: z.string().min(1, "Current address is required"),
    japanAddress: z.string().optional(),
    email: z.string().regex(emailRegex, "Invalid email format"),
    phone: z.string().regex(phoneRegex, "Invalid phone format"),
    photoUrl: z.string().optional(),
    familyDetails: z.array(familyDetailSchema).optional(),
    physicalStats: physicalStatsSchema.optional(),
  }),
  education: z.array(
    z.object({
      schoolName: z.string().min(1, "School name is required"),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date"),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date"),
      status: z.enum(["Graduated", "Dropout"]),
    }),
  ),
  workHistory: z.array(
    z.object({
      companyName: z.string().min(1, "Company name is required"),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date"),
      endDate: z.union([
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        z.literal("Current"),
      ]),
      role: z.string().min(1, "Role is required"),
      description: z.string().optional(),
    }),
  ),
  skills: z.object({
    jlptLevel: z.enum(["N1", "N2", "N3", "N4", "N5", "None"]).optional(),
    sswCertificates: z.array(z.string()).optional(),
    technicalSkills: z.array(z.string()).optional(),
  }),
  motivation: z.object({
    reasonForApplying: z
      .string()
      .min(10, "Reason must be at least 10 characters"),
    selfPR: z.string().min(10, "Self-PR must be at least 10 characters"),
  }),
});
