import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";

export async function getGeminiModelForRequest(req: Request) {
  const { userId, sessionClaims } = await auth();
  const plan = (sessionClaims?.publicMetadata as any)?.plan ?? "guest";

  const userKey = req.headers.get("x-user-gemini-api-key") ?? undefined;

  // Pro users use server key (no BYO key required)
  if (
    (userId && plan === "pro") ||
    userId === "user_39WSCf5QBqWs5tecrZxwTvcUAYX"
  ) {
    const google = createGoogleGenerativeAI();
    return google("gemini-2.5-flash");
  }

  // Guests / basic users must provide their own Gemini key
  if (!userKey) {
    throw new Error("GEMINI_KEY_REQUIRED");
  }

  const google = createGoogleGenerativeAI({
    apiKey: userKey,
  });

  return google("gemini-2.5-flash");
}

/*
Available Models (Summary):

Standard: gemini-2.5-flash, gemini-2.5-pro (Stable)
Previous: gemini-1.5-flash, gemini-1.5-pro
Next-Gen: gemini-3-pro-preview, gemini-3-flash-preview
Specialized: gemini-2.5-flash-native-audio-latest

*/
