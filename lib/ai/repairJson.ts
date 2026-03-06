/**
 * Strips markdown code fences from AI model output and parses JSON.
 * Ollama models often wrap JSON in ```json ... ``` blocks.
 */
export function cleanAndParseJson<T>(text: string): T {
  let cleaned = text.trim();

  // Strip markdown code fences: ```json ... ``` or ``` ... ```
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  return JSON.parse(cleaned);
}
