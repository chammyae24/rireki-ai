import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";

export async function getGeminiModelForRequest(req: Request) {
  const { userId, sessionClaims } = await auth();
  const plan = (sessionClaims?.publicMetadata as any)?.plan ?? "guest";

  const userKey = req.headers.get("x-user-gemini-api-key") ?? undefined;

  // Pro users use server key (no BYO key required)
  if (userId && plan === "pro") {
    const google = createGoogleGenerativeAI();
    return google("gemini-1.5-pro-latest");
  }

  // Guests / basic users must provide their own Gemini key
  if (!userKey) {
    throw new Error("GEMINI_KEY_REQUIRED");
  }

  const google = createGoogleGenerativeAI({
    apiKey: userKey,
  });

  return google("gemini-1.5-pro-latest");
}
