import { askLlm } from "../utils/llm.js";
import { SearchParamsSchema} from "../schemas/search.schema.js";

export async function interpretMessage(message: string) {
  const prompt = `
Convert this restaurant request into structured parameters.

Return JSON ONLY.

Schema:
{
  "query": string,
  "near": string,
  "price": number,
  "open_now": boolean
}

price guide:
1 = cheap
2 = moderate
3 = expensive

User request:
${message}
`;

  const raw = await askLlm(prompt);

  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("LLM did not return JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return SearchParamsSchema.parse(parsed);
}
