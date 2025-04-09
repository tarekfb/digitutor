import { z } from "zod";

export const max = 1000;
const min = 5;

export const reportBugSchema = z.object({
  description: z
    .string()
    .max(max, `Får inte vara mer än ${max} karaktärer.`)
    .optional(),
  trackingId: z.string().optional(),
}).superRefine((data, ctx) => {
  // only apply the min constraint if trackingId is not set
  if (
    (!data.trackingId || data.trackingId === "undefined") &&
    !data.description || (data.description &&
      data.description.length > 0 &&
      data.description.length <= min)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Måste vara minst ${min} karaktärer`,
      path: ["description"],
    });
  }
});;
