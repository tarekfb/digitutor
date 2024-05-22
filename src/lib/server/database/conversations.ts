import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "src/supabase"
import type { Conversation } from "src/lib/models/conversations";

export const getConversation = async (
  supabase: SupabaseClient<Database>,
  id: string
): Promise<Conversation> => {
  const { data, error } = await supabase
    .from("conversations")
    .select(
      `
                  *,
                  teacher (
                    *
                  ),
                  student (
                    *
                  )
                `,
    )
    .eq("id", id)
    .limit(1)
    .single();

  if (error) {
    console.error("Failed to get conversation: " + id, { error });
    throw error;
  }

  return data as unknown as Conversation;
}

export const getConversations = async (
  supabase: SupabaseClient<Database>,
  userId: string,
  max?: number,
): Promise<Conversation[]> => {
  let query = supabase
    .from("conversations")
    .select(
      `
          *,
          teacher (
            *
          ),
          student (
            *
          )
        `,
    )
    .or(`teacher.eq.${userId},student.eq.${userId}`)
  // todo rewrite this function to take teacherid or studentid, and improve this search

  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.error("Failed to get conversations for userid: " + userId, { error });
    throw error;
  }

  return data as unknown as Conversation[];
}
