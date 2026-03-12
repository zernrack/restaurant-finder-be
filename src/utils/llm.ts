import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "../config/env.js";

export async function askLlm(prompt: string): Promise<string> {
    const genAi = new GoogleGenAI({ apiKey: getGeminiApiKey() });

    const result = await genAi.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt
    })

    return result.text ?? ''
}
