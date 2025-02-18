import { z } from "zod";
import type { Profile } from "./profile.ts";

export const searchSchema = z
  .object({
    query: z.string().max(50, "För många karaktärer.").optional(),
    subjects: z.string(),
  })
  .superRefine((data, ctx) => {
    // only apply the constraint if subjects is not set
    if (
      (!data.subjects || data.subjects !== "undefined") &&
      data.query &&
      data.query.length > 0 &&
      data.query.length <= 2
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Måste vara minst 3 karaktärer",
        path: ["query"],
      });
    }
  });

export type SearchResult = {
  id: string;
  title: string;
  description?: string;
  hourlyPrice: number;
  subjects: number[];
  profile: Omit<Profile, "lastName" | "bio"> & {
    lastInitial: string
  };
};
