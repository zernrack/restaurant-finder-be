import { GoogleGenAI } from "@google/genai";

const aiApi = process.env.GEMINI_API_KEY;

if (!aiApi) throw new Error("AI API is missing/not set!");

const genAi = new GoogleGenAI({ apiKey: aiApi });

export async function askLlm(prompt: string): Promise<string> {
    const result = await genAi.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    })

    return result.text ?? " "
}
