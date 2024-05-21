import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "src/supabase"

export const getMessages = async (
  supabase: SupabaseClient<Database>,
  conversationId: string,
  max?: number,
): Promise<Tables<"messages">[] | null> => {
  let query = supabase
    .from("messages")
    .select('*')
    .eq("conversation", conversationId)

  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.log(`Failed to fetch messages for conversationId: ${conversationId}`, { error });
    throw error;
  }

  return data;
}
