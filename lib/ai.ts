import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

/**
 * Returns the best available LLM model instance based on environment configuration.
 *
 * Supported configurations:
 * 1. FreeLLMAPI / Custom OpenAI-compatible proxy (AI_BASE_URL, AI_API_KEY, AI_MODEL)
 * 2. Groq Free Tier (GROQ_API_KEY, GROQ_MODEL)
 * 3. OpenAI (OPENAI_API_KEY, OPENAI_MODEL)
 * 4. Google Gemini API (GEMINI_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY)
 */
export function getLLMModel() {
  // 1. Check for FreeLLMAPI or custom OpenAI-compatible proxy endpoint
  if (process.env.AI_BASE_URL) {
    const customAI = createOpenAI({
      baseURL: process.env.AI_BASE_URL,
      apiKey: process.env.AI_API_KEY || "freellmapi-key",
    });
    const modelName = process.env.AI_MODEL || "gemini-2.5-flash";
    return customAI(modelName);
  }

  // 2. Check for Groq free high-speed API
  if (process.env.GROQ_API_KEY) {
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    });
    const modelName = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
    return groq(modelName);
  }

  // 3. Check for standard OpenAI key
  if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";
    return openai(modelName);
  }

  // 4. Default to Google Gemini (configured via GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY)
  const geminiModel = process.env.GEMINI_MODEL || "gemini-2.0-flash-001";
  return google(geminiModel) as any;
}
