import { z } from "zod";
import type { Profile } from "./profile";

export const searchSchema = z.object({
    query: z
        .string()
        .min(3, "Sök på minst 3 karaktärer.")
        .max(50, "För många karaktärer.")
})

export type SearchResult = {
    id: string;
    title: string;
    description?: string;
    hourlyPrice: number;
    firstName: string;
    lastName: string;
    avatar?: string;
    subjects: number[],
    profile: Profile
}