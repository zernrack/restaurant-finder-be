import { z } from "zod";

export const SearchParamsSchema = z.object({
  query: z.string(),
  location: z.string().optional(),
  price: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.number().optional(),
  ),
  open_now: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.boolean().optional(),
  ),
});
export type SearchParams = z.infer<typeof SearchParamsSchema>;
