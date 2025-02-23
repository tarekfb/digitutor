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

const addReviewProperties = {
  rating: z.coerce
    .number()
    .min(1, "Måste vara minst 1.")
    .max(5, "Får inte vara mer än 5."),
  description: z
    .string()
    .min(1, "Får inte vara tom.")
    .max(100, "Får inte vara mer än 100 karaktärer.")
    .optional(),
};

export const addReviewSchema = z.object(addReviewProperties);
export type AddReviewSchema = typeof addReviewSchema;

// export type DbDisplayProfile = {
//   id: Profile["id"];
//   first_name: DbProfile["first_name"];
//   avatar_url: DbProfile["avatar_url"];
//   avg_rating: number;
//   review_count: number;
//   five_star_reviews_with_description: number;
//   subjects: DbSubject[];
//   reviews: {
//     rating: DbReviewBase["rating"];
//     review_id: DbReviewBase["id"];
//     sender_id: DbReviewBase["sender"];
//     receiver_id: DbReviewBase["receiver"];
//     created_at: DbReviewBase["created_at"];
//     description: DbReviewBase["description"];
//     sender_name?: DbProfile["first_name"];
//     receiver_name: DbReviewWithReferences["receiver"]["first_name"];
//   }[];
// };

// export type DisplayProfile = {
//   id: string;
//   firstName: Profile["firstName"];
//   avatarUrl: Profile["avatarUrl"];
//   avgRating: number;
//   subjects: Subject[];
// };

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
