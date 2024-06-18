import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "src/supabase"
import type { InputMessage } from "$lib/shared/models/conversation"
import { getNow } from '$lib/utils'

export const getMessages = async (
  supabase: SupabaseClient<Database>,
  conversationId: string,
  max?: number,
): Promise<Tables<"messages">[] | null> => {
  let query = supabase
    .from("messages")
    .select('*')
    .eq("conversation", conversationId)

  if (max) {
    query = query.limit(max)
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Failed to fetch messages for conversationId: ${conversationId}`, { error });
    throw error;
  }

  if (!data) {
    console.error("Failed to get messages. Response was null");
    throw new Error("Unexpected null response");
  }
  if (max) return data.reverse();
  return data;
}


export const sendMessage = async (
  supabase: SupabaseClient<Database>,
  input: InputMessage,
  session: Session
): Promise<Tables<"messages">> => {
  const dbMessage: Tables<"messages"> = {
    id: crypto.randomUUID(),
    sender: session.user.id,
    conversation: input.conversation,
    content: input.content,
    created_at: getNow(),
  };

  const { data, error } = await supabase
    .from("messages")
    .insert(dbMessage)
    .select('*')
    .limit(1)
    .order("id")
    .single();

  if (error) {
    console.error("Failed to send message: ", { dbMessage, error });
    throw error;
  }

  if (!data) {
    console.error("Failed to send message. Response was null");
    throw new Error("Unexpected null response");
  }

  return data;
};
