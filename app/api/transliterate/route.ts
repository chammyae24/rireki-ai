import { generateObject } from "ai";
import { z } from "zod";
import { getGeminiModelForRequest } from "@/lib/ai/getGeminiModel";

const transliterationSchema = z.object({
  katakana: z.string(),
  pronunciation: z.string(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { name, sourceLanguage } = await req.json();

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const model = await getGeminiModelForRequest(req);

    const { object: result } = await generateObject({
      model,
      schema: transliterationSchema,
      prompt: `Transliterate this name from ${sourceLanguage} to Japanese Katakana for a formal job application (履歴書).

      Name: ${name}
      Source Language: ${sourceLanguage}

      Guidelines:
      - Use proper Japanese phonetics suitable for formal documents
      - Apply Hepburn romanization principles adapted to Katakana
      - Use interpuncts (・) between name components
      - Ensure the result sounds natural to Japanese speakers
      - Consider the speaker's likely pronunciation, not just strict letter-by-letter conversion

      Return the katakana, pronunciation guide in romaji, and any important notes about the transliteration.`,
    });

    return Response.json(result);
  } catch (error: any) {
    if (error.message === "GEMINI_KEY_REQUIRED") {
      return new Response("Gemini API Key required", { status: 401 });
    }
    console.error("Transliteration error:", error);
    return Response.json({ error: "Failed to transliterate" }, { status: 500 });
  }
}
