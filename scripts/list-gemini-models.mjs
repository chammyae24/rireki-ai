import fs from "fs";
import path from "path";

// Load environment variables from .env manually since dotenv might not be installed
const envPath = path.join(process.cwd(), ".env");
let apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");
  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"]|['"]$/g, ""); // Remove quotes
      if (key === "GOOGLE_GENERATIVE_AI_API_KEY") {
        apiKey = value;
        break;
      }
    }
  }
}

if (!apiKey) {
  console.error(
    "Error: GOOGLE_GENERATIVE_AI_API_KEY not found in .env or environment.",
  );
  process.exit(1);
}

console.log("Fetching available Gemini models...");

try {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
  );

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${response.status}: ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (data.models) {
    console.log("\nAvailable Models:");
    data.models.forEach((model) => {
      // Filter for 'gemini' models to keep it relevant
      if (model.name.includes("gemini")) {
        console.log(`- ${model.name.replace("models/", "")}`);
        console.log(`  Description: ${model.description}`);
        console.log(`  Input Token Limit: ${model.inputTokenLimit}`);
        console.log(`  Output Token Limit: ${model.outputTokenLimit}`);
        console.log("---");
      }
    });
  } else {
    console.log("No models found in response.");
  }
} catch (error) {
  console.error("Failed to list models:", error);
}
