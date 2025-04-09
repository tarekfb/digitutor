import type { Tables } from "src/supabase.ts";
import { z } from "zod";
import type { DbProfile, Profile } from "./profile.ts";
import type { DbSubject, Subject } from "./subject.ts";

export type DbReviewBase = Tables<"reviews">;

export type DbReviewWithReferences = Omit<
  DbReviewBase,
  "sender" | "receiver"
> & {
  sender: DbProfile | null;
  receiver: DbProfile;
};

export type ReviewBase = Omit<
  DbReviewBase,
  "created_at" | "description" | "sender"
> & {
  createdAt: string;
  description: string;
  sender?: string;
};

export type ReviewWithReferences = Omit<ReviewBase, "receiver" | "sender"> & {
  sender?: Profile;
  receiver: Profile;
};

export type InputReview = Pick<DbReviewBase, "description" | "rating">;


export const maxReviewLength = 500;
const addReviewProperties = {
  rating: z.coerce
    .number()
    .min(1, "Måste vara minst 1.")
    .max(5, "Får inte vara mer än 5."),
  description: z
    .string()
    .min(1, "Får inte vara tom.")
    .max(maxReviewLength, `Får inte vara mer än ${maxReviewLength} karaktärer.`)
    .optional(),
};

export const addReviewSchema = z.object(addReviewProperties);
export type AddReviewSchema = typeof addReviewSchema;

export type DbTopTeacher = {
  id: Profile["id"];
  first_name: DbProfile["first_name"];
  avatar_url: DbProfile["avatar_url"];
  review_count: number;
  avg_rating: number;
  five_star_reviews_with_description: number;
  subjects: DbSubject[];
  reviews: DbReviewWithReferences[];
};

export type TopTeacher = {
  id: string;
  firstName: Profile["firstName"];
  avatarUrl: Profile["avatarUrl"];
  avgRating: number;
  reviewCount: number;
  fiveStarReviewsWithDescription: number;
  subjects: Subject[];
  reviews: ReviewWithReferences[];
};

export type DbRating = Pick<DbProfile, "id" | "first_name" | "avatar_url" | "created_at" | "updated_at"> & {
  review_count: number;
  avg_rating: number;
}

export type Rating = Pick<Profile, "id" | "firstName" | "avatarUrl"> & {
  reviewCount: number;
  avgRating: number;
}