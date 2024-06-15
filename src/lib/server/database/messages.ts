import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "src/supabase"
import type { InputMessage } from "src/lib/shared/models/conversations"
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
): Promise<Tables<"messages">> => {
  const session = await supabase.auth.getSession();

  if (!session.data.session) {
    console.error("Missing session when sending message for conv id: ", { message: input.conversation });
    throw new Error("No session");
  }

  const sender = session.data.session.user.id;

  const dbMessage: Tables<"messages"> = {
    id: crypto.randomUUID(),
    sender,
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
