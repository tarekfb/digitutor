import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { DbDisplayProfile, InputReview, DbReviewWithReferences } from "src/lib/shared/models/review";
import { getNow } from "src/lib/shared/utils/utils";
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

    return data;
};

export const getReviewsByReceiver = async (
    supabase: SupabaseClient<Database>,
    receiver: string,
    max?: number,
): Promise<DbReviewWithReferences[]> => {
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
        console.error(`Failed to read reviews"for userId" + receiver`, { error });
        throw error;
    }

    return data as unknown as DbReviewWithReferences[];
}

export const getReviewsBySender = async (
    supabase: SupabaseClient<Database>,
    sender: string,
    max?: number,
): Promise<DbReviewWithReferences[]> => {
    let query = supabase
        .from("reviews")
        .select(`
            *,
            sender ("*"),
            receiver ("*")
          `)
        .eq("receiver", sender)

    if (max) query = query.limit(max);

    const { data, error } = await query;

    if (error) {
        console.error(`Failed to read reviews "for userId" sender`, { error });
        throw error;
    }

    return data as unknown as DbReviewWithReferences[];
}

export const getHighQualityReviews = async (supabase: SupabaseClient<Database>, max?: number) => {
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

    return data as unknown as DbReviewWithReferences[];
}


export const getTopTeacherByReviews = async (supabase: SupabaseClient<Database>, max?: number): Promise<DbDisplayProfile[]> => {
    // @ts-ignore
    let query = supabase.rpc('get_top_teacher_by_reviews')

    if (max) query = query.limit(max);
    const { data, error } = await query;

    if (error) {
        console.error(`Failed to find reviews`, { error });
        throw error;
    }

    return data as unknown as DbDisplayProfile[];
}