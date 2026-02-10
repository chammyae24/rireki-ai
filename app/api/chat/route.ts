import { streamText } from "ai";
import { getGeminiModelForRequest } from "@/lib/ai/getGeminiModel";

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const systemMessage = {
      role: "system" as const,
      content: `You are a Japanese resume assistant. Help users fill out their Rirekisho (履歴書) form.

      Current resume context:
      ${JSON.stringify(context, null, 2)}

      Guidelines:
      - Be professional and helpful
      - Ask questions when information is missing
      - Provide suggestions in business Japanese
      - Keep responses concise (2-3 sentences max)
      - When the user provides information, acknowledge it and ask if they want to update their resume`,
    };

    const model = await getGeminiModelForRequest(req);

    const result = streamText({
      model,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      // maxTokens: 500, // Error: Object literal may only specify known properties
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    if (error.message === "GEMINI_KEY_REQUIRED") {
      return new Response("Gemini API Key required", { status: 401 });
    }
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
