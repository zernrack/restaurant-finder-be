import { askLlm } from "../utils/llm.js";
import { SearchParamsSchema} from "../schemas/search.schema.js";

export async function interpretMessage(message: string) {
const prompt = `
Extract restaurant search parameters from this query.

User query:
"${message}"

Return ONLY JSON in this format:

{
  "query": "restaurant type or cuisine",
  "location": "city if mentioned",
  "price": 1 | 2 | 3 | 4,
  "open_now": true | false | null
}

Rules:
- query = cuisine or food type
- location = city if mentioned
- price = 1 cheap, 2 moderate, 3 expensive, 4 luxury
- open_now = true only if user mentions "open now"
`;

  const raw = await askLlm(prompt);

  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("LLM did not return JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return SearchParamsSchema.parse(parsed);
}
