import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "src/supabase";
import type { InputMessage } from "$lib/shared/models/conversation";
import { getNow } from "src/lib/shared/utils/utils";

export const getRequestMessages = async (
  supabase: SupabaseClient<Database>,
  conversationId: string,
  max?: number,
): Promise<Tables<"request_messages">[] | null> => {
  let query = supabase
    .from("request_messages")
    .select("*")
    .eq("conversation", conversationId);

  if (max) {
    query = query.limit(max);
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      `Failed to fetch request messages for requestConversationId: ${conversationId}`,
      { error },
    );
    throw error;
  }

  if (max) return data.reverse();
  return data;
};

export const sendRequestMessage = async (
  supabase: SupabaseClient<Database>,
  { conversation, content }: InputMessage,
  session: Session,
): Promise<Tables<"request_messages">> => {
  const dbMessage: Tables<"request_messages"> = {
    id: crypto.randomUUID(),
    sender: session.user.id,
    conversation_request: conversation,
    content: content,
    created_at: getNow(),
  };


  console.log(session.user.id); // fails at rls
  const { data, error } = await supabase
    .from("request_messages")
    .insert(dbMessage)
    .select("*")
    .limit(1)
    .order("id")
    .single();

  if (error) {
    console.error("Failed to send request message: ", { dbMessage, error });
    throw error;
  }

  return data;
};
