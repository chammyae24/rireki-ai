import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { LanguageModel } from "ai";

export async function getGeminiModelForRequest(
  req: Request,
): Promise<LanguageModel> {
  const { userId, sessionClaims } = await auth();
  const plan = (sessionClaims?.publicMetadata as any)?.plan ?? "guest";

  const userKey = req.headers.get("x-user-gemini-api-key") ?? undefined;

  console.log("userId", userId);

  // We are currently using "Ollama Cloud" as main
  // NOTE: Use https://ollama.com/v1 (not api.ollama.com which redirects and strips auth headers)
  if (process.env.OLLAMA_API_KEY) {
    const ollamaCloud = createOpenAI({
      baseURL: process.env.OLLAMA_BASE_URL || "https://ollama.com/v1",
      apiKey: process.env.OLLAMA_API_KEY,
    });

    // Use .chat() to force the classic /chat/completions endpoint
    // The default ollamaCloud() uses OpenAI's Responses API which Ollama doesn't support
    return ollamaCloud.chat(
      process.env.OLLAMA_MODEL || "glm-4.6",
    ) as unknown as LanguageModel;
  }

  // Pro users use server key (no BYO key required)
  if (
    (userId && plan === "pro") ||
    userId === "user_3ARPh8K6c8gmrmScsNPadk38AVH"
  ) {
    const google = createGoogleGenerativeAI();
    return google("gemini-3-flash-preview") as LanguageModel;
  }

  // Guests / basic users must provide their own Gemini key
  if (!userKey) {
    throw new Error("GEMINI_KEY_REQUIRED");
  }

  const google = createGoogleGenerativeAI({
    apiKey: userKey,
  });

  return google("gemini-2.5-flash") as LanguageModel;
}
