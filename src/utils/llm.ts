import Groq from "groq-sdk";
import { getGroqApiKey } from "../config/env.js";

const groq = new Groq({
  apiKey: getGroqApiKey(),
});

/**
 * Available models to rotate through if rate limits occur
 */
const MODELS = [
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "moonshotai/kimi-k2-instruct-0905",
];

export async function askLlm(prompt: string): Promise<string> {
  let lastError: unknown;

  for (const model of MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0,
      });

      const text = completion.choices[0]?.message?.content;

      if (text) {
        return text;
      }
    } catch (error) {
      console.warn(`LLM model failed: ${model}`);
      lastError = error;
    }
  }

  console.error("All LLM models failed");

  throw lastError ?? new Error("LLM request failed");
}
