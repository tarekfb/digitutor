import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { InputReview, Review } from "src/lib/shared/models/review";
import { getNow } from "src/lib/utils";
import type { Database, Tables } from "src/supabase";


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
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error("Failed to create review: ", { error });
        throw error;
    }

    if (!data) {
        console.error("Failed to create review. Response was null.");
        throw new Error("Unexpected null response");
    }

    return data;
};

export const getReviewsByReceiver = async (
    supabase: SupabaseClient<Database>,
    receiver: string,
    max?: number,
): Promise<Review[]> => {
    let query = supabase
        .from("reviews")
        .select(`
            *,
            sender ("*"),
            receiver ("*")
          `)
        .eq("receiver", receiver)

    if (max) query = query.limit(max);

    const { data, error } = await query;

    if (error) {
        console.error(`Failed to read reviews ${receiver ? "for userId" + receiver : ''}`, { error });
        throw error;
    }

    if (!data) {
        console.error(`Failed to get reviews for teacher ${receiver}. Response was null`);
        throw new Error("Unexpected null response");
    }

    return data as unknown as Review[];
}

export const getDisplayReviews = async (supabase: SupabaseClient<Database>, max?: number) => {
    let query = supabase
        .from("reviews")
        .select(`
            *,
            sender ("*"),
            receiver ("*")
          `)
        .eq("rating", 5)
        .neq("description", 'null')
    // .gt('length(description)', 10) // no built in support for length, drizzle?

    if (max) query = query.limit(max);

    const { data, error } = await query;

    if (error) {
        console.error(`Failed to find review to display`, { error });
        throw error;
    }

    if (!data) {
        console.error(`Failed to find review to display. Response was null`);
        throw new Error("Unexpected null response");
    }

    return data as unknown as Review[];
}
