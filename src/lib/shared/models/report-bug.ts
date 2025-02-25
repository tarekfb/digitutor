import { z } from "zod";

export const reportBugSchema = z.object({
  description: z
    .string()
    .min(5, "Måste vara minst 5 karaktärer.")
    .max(500, "Får inte vara mer än 500 karaktärer.")
    .optional(),
  trackingId: z.string().optional(),
});
