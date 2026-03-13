import { z } from "zod";

export const SearchParamsSchema = z.object({
  query: z.string(),
  location: z.string().optional(),
  price: z.number().optional(),
  open_now: z.boolean().optional().nullable(),
});
export type SearchParams = z.infer<typeof SearchParamsSchema>;
