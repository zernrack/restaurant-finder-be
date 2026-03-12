import { z } from "zod";

export const SearchParamsSchema = z.object({
  query: z.string(),
  near: z.string().optional(),
  price: z.number().optional(),
  open_now: z.boolean().optional(),
});

export type SearchParams = z.infer<typeof SearchParamsSchema>;