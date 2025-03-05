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
      data.query.length <= 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Måste vara minst 1 karaktär",
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
  profile: Omit<Profile, "bio">;
  avgRating: number;
  reviewCount: number;
};

export type SortMethod = (list: SearchResult[], ascending: boolean) => SearchResult[];

export type SortingSearchOption = {
  ascending: boolean;
  id: string;
  readable: string;
  onSelect: SortMethod;
}