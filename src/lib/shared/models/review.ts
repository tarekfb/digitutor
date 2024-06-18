import type { Tables } from "src/supabase";
import { z } from "zod"

export type Review = Omit<Tables<"reviews">, "sender" | "receiver"> & {
    sender: Tables<"profiles">;
    receiver: Tables<"profiles">;
};
export type InputReview = Pick<Tables<"reviews">, 'description' | 'rating'>;

const addReviewProperties = {

    rating:
        z
            .coerce.number()
            .min(1, "Måste vara minst 1.")
            .max(5, "Får inte vara mer än 5."),
    description: z
        .string()
        .min(1, "Får inte vara tom.")
        .max(100, "Fär inte vara mer för 300 karaktärer.")
        .optional()
}

export const addReviewSchema = z.object(addReviewProperties)
export type AddReviewSchema = typeof addReviewSchema;
