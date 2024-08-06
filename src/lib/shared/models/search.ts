import { z } from "zod";

export const searchSchema = z.object({
    query: z
        .string()
        .min(3, "Måste vara minst 3 karaktärer.")
        .max(50, "Får inte vara mer än 50 karaktärer.")
})

export type SearchResult = {
    id: string;
    title: string;
    description?: string;
    hourlyPrice: number;
    firstName: string;
    lastName: string;
    avatar?: string;
}