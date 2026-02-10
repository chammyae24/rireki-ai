import { generateObject } from "ai";
import { z } from "zod";
import { RirekishoData } from "@/types/resume";
import { getGeminiModelForRequest } from "@/lib/ai/getGeminiModel";

const gapSchema = z.object({
  missingFields: z.array(
    z.object({
      field: z.string(),
      section: z.string(),
      importance: z.enum(["high", "medium", "low"]),
      question: z.string(),
    }),
  ),
  suggestions: z.array(z.string()),
  isComplete: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const { resumeData }: { resumeData: RirekishoData } = await req.json();

    const model = await getGeminiModelForRequest(req);

    const { object: analysis } = await generateObject({
      model,
      schema: gapSchema,
      prompt: `Analyze this resume data for a Japanese job application and identify missing information.

      Resume Data:
      ${JSON.stringify(resumeData, null, 2)}

      For each visa tier, these fields are critical:
      - ENGINEER: technicalSkills, jlptLevel, motivation.reasonForApplying
      - SSW: sswCertificates, technicalSkills, physicalStats
      - TITP: familyDetails, physicalStats, motivation fields

      Identify:
      1. Any null/empty fields
      2. Fields that should be expanded (too short descriptions)
      3. Missing context for work history

      Return a structured analysis with specific questions to ask the user.`,
    });

    return Response.json(analysis);
  } catch (error: any) {
    if (error.message === "GEMINI_KEY_REQUIRED") {
      return new Response("Gemini API Key required", { status: 401 });
    }
    console.error("Gap Analysis Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
