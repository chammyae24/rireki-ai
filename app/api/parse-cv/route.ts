import { generateObject } from "ai";
import { z } from "zod";
// @ts-ignore
import pdfParse from "pdf-parse";
import { getGeminiModelForRequest } from "@/lib/ai/getGeminiModel";

const parsedCVSchema = z.object({
  personalInfo: z.object({
    fullName: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    currentAddress: z.string().optional(),
  }),
  education: z.array(
    z.object({
      schoolName: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      status: z.enum(["Graduated", "Dropout"]),
    }),
  ),
  workHistory: z.array(
    z.object({
      companyName: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      role: z.string(),
      description: z.string().optional(),
    }),
  ),
  skills: z.array(z.string()),
  confidence: z.object({
    personalInfo: z.number().min(0).max(1),
    education: z.number().min(0).max(1),
    workHistory: z.number().min(0).max(1),
    skills: z.number().min(0).max(1),
  }),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Parse PDF content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    const model = await getGeminiModelForRequest(req);

    // AI parsing
    const { object: parsedData } = await generateObject({
      model,
      schema: parsedCVSchema,
      prompt: `Extract structured resume information from this CV text.

      CV Text:
      """
      ${extractedText}
      """

      Extract:
      1. Personal information (name, email, phone, address)
      2. Education history with dates
      3. Work history with company names, dates, roles, descriptions
      4. Skills and certifications

      Also provide confidence scores (0-1) for each section based on data quality.
      Return in the specified schema format.`,
    });

    return Response.json(parsedData);
  } catch (error: any) {
    if (error.message === "GEMINI_KEY_REQUIRED") {
      return new Response("Gemini API Key required", { status: 401 });
    }
    console.error("PDF parsing error:", error);
    return Response.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
