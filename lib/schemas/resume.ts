import { z } from "zod";

export const resumeSchema = z.object({
  tier: z.enum(["TITP", "SSW", "ENGINEER"]),
  personalInfo: z.object({
    fullName: z.string().min(1, "Name is required"),
    katakanaName: z.string().min(1, "Katakana name is required"),
    gender: z.enum(["Male", "Female"]),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    currentAddress: z.string().min(1, "Address is required"),
    japanAddress: z.string().optional(),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    photoUrl: z.string().optional(),
  }),
  education: z.array(
    z.object({
      schoolName: z.string().min(1, "School name is required"),
      startDate: z
        .string()
        .regex(/^\d{4}-\d{2}$/, "Invalid date format (YYYY-MM)"),
      endDate: z
        .string()
        .regex(/^\d{4}-\d{2}$/, "Invalid date format (YYYY-MM)")
        .or(z.literal("Current")),
      status: z.enum(["Graduated", "Dropout"]),
    }),
  ),
  workHistory: z.array(
    z.object({
      companyName: z.string().min(1, "Company name is required"),
      startDate: z
        .string()
        .regex(/^\d{4}-\d{2}$/, "Invalid date format (YYYY-MM)"),
      endDate: z
        .string()
        .regex(/^\d{4}-\d{2}$/, "Invalid date format (YYYY-MM)")
        .or(z.literal("Current")),
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
    reasonForApplying: z.string().min(1, "Reason for applying is required"),
    selfPR: z.string().min(1, "Self PR is required"),
  }),
});
