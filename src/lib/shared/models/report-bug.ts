import { z } from "zod";

const max = 500;
const min = 5;

export const reportBugSchema = z.object({
  description: z
    .string()
    .min(min, `Måste vara minst ${min} karaktärer.`)
    .max(max, `Får inte vara mer än ${max} karaktärer.`)
    .optional(),
  trackingId: z.string().optional(),
}).superRefine((data, ctx) => {
  // only apply the min constraint if trackingId is not set
  if (
    (!data.trackingId || data.trackingId !== "undefined") &&
    data.description &&
    data.description.length > 0 &&
    data.description.length <= 2
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Måste vara minst ${min} karaktärer`,
      path: ["query"],
    });
  }
  // although it can never be more than 500, regardless of trackingId
  if (
    data.description &&
    data.description.length > max
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Får inte vara mer än ${max} karaktärer`,
      path: ["query"],
    });
  }
});;
