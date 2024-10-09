import type { Tables } from "src/supabase";
import { z } from "zod"

export type Review = Omit<Tables<"reviews">, "sender" | "receiver"> & {
    sender: Tables<"profiles"> | null;
    receiver: Tables<"profiles">;
};
export type InputReview = Pick<Tables<"reviews">, 'description' | 'rating'>;

const addReviewProperties = {
    rating: z
        .coerce.number()
        .min(1, "Måste vara minst 1.")
        .max(5, "Får inte vara mer än 5."),
    description: z
        .string()
        .min(1, "Får inte vara tom.")
        .max(100, "Får inte vara mer än 100 karaktärer.")
        .optional()
}

export const addReviewSchema = z.object(addReviewProperties)
export type AddReviewSchema = typeof addReviewSchema;

export type DbDisplayReview = {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    avg_rating: number | null;
}


export type DisplayReview = {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    avgRating: number;
}

export const formatDisplayReview = (review: DbDisplayReview): DisplayReview => {
    return {
        id: review.id,
        firstName: review.first_name,
        lastName: review.last_name,
        avatarUrl: review.avatar_url,
        avgRating: review.avg_rating || 0,
    };
}