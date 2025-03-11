import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type {
  InputReview,
  DbReviewWithReferences,
  DbTopTeacher,
  DbRating,
} from "src/lib/shared/models/review.ts";
import { getNow } from "src/lib/shared/utils/utils.ts";
import type { Database, Tables } from "src/supabase.ts";

export const createReview = async (
  supabase: SupabaseClient<Database>,
  input: InputReview,
  receiver: string,
  session: Session,
): Promise<Tables<"reviews">> => {
  const sender = session.user.id;

  const dbReview: Tables<"reviews"> = {
    ...input,
    id: crypto.randomUUID(),
    created_at: getNow(),
    sender,
    receiver,
  };

  const { data, error } = await supabase
    .from("reviews")
    .insert(dbReview)
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Failed to create review: ", { error });
    throw error;
  }

  return data;
};

export const getReviewsByReceiver = async (
  supabase: SupabaseClient<Database>,
  receiver: string,
  max?: number,
): Promise<DbReviewWithReferences[]> => {
  let query = supabase
    .from("reviews")
    .select(
      `
            *,
            sender ("*"),
            receiver ("*")
          `,
    )
    .eq("receiver", receiver);

  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.error(`Failed to read reviews"for userId" + receiver`, { error });
    throw error;
  }

  return data as unknown as DbReviewWithReferences[];
};

export const getReviewsBySender = async (
  supabase: SupabaseClient<Database>,
  sender: string,
  max?: number,
): Promise<DbReviewWithReferences[]> => {
  let query = supabase
    .from("reviews")
    .select(
      `
            *,
            sender ("*"),
            receiver ("*")
          `,
    )
    .eq("receiver", sender);

  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.error(`Failed to read reviews "for userId" sender`, { error });
    throw error;
  }

  return data as unknown as DbReviewWithReferences[];
};

export const getHighQualityReviews = async (
  supabase: SupabaseClient<Database>,
  max?: number,
) => {
  let query = supabase
    .from("reviews")
    .select(
      `
            *,
            sender ("*"),
            receiver ("*")
          `,
    )
    .eq("rating", 5)
    .neq("description", "null");
  // .gt('length(description)', 10) // no built in support for length, drizzle?

  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.error(`Failed to find review to display`, { error });
    throw error;
  }

  return data as unknown as DbReviewWithReferences[];
};

export const getTopTeacher = async (
  supabase: SupabaseClient<Database>,
  max?: number,
  withReviews: boolean = true,
): Promise<DbTopTeacher[]> => {
  let query = supabase.from("top_rated_teachers").select("*").eq("avg_rating", 5);

  if (withReviews) query = query.gt("five_star_reviews_with_description", 0);
  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.error(`Failed to find top teachers`, { error });
    throw error;
  }

  return data as unknown as DbTopTeacher[];
};

export const getRating = async (
  supabase: SupabaseClient<Database>,
  teacher: string
): Promise<DbRating> => {
  const { data, error } = await supabase
    .from("avg_rating")
    .select("*")
    .eq("id", teacher)
    .limit(1)
    .single();

  if (error) {
    console.error("Failed to get rating for teacher: " + teacher, { error });
    throw error;
  }

  return data as unknown as DbRating;
}