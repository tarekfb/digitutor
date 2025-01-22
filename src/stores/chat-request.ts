import { asyncWritable, type WritableLoadable } from "@square/svelte-store";
import type {
  RealtimePostgresInsertPayload,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";
import type { Database, Tables } from "src/supabase";
import { initMessagesCount } from "$lib/shared/constants/constants";
import {
  type Message,
} from "src/lib/shared/models/conversation";
import { getNow } from "src/lib/shared/utils/utils";
import { formatRequestMessage } from "src/lib/shared/utils/message/utils";
import type { RequestMessage } from "src/lib/shared/models/conversation-request";

export const getMessages = async (
  supabase: SupabaseClient<Database>,
  conversationId: string,
  loadMore = 0,
): Promise<RequestMessage[]> => {
  let initCount = initMessagesCount;
  const query = supabase
    .from("request_messages")
    .select("*")
    .eq("conversation_request", conversationId)
    .order("created_at", { ascending: true })
    .limit((initCount += loadMore));

  const { data, error } = await query;

  if (error) {
    console.error(
      `Failed to fetch request messages for conversationId: ${conversationId}`,
      { error },
    );
    throw error;
  }

  return data.map((message) => formatRequestMessage(message));
};

export const sendMessage = async (
  supabase: SupabaseClient<Database>,
  { createdAt, content, id, conversation }: Message,
  session: Session,
): Promise<Tables<"request_messages">> => {
  const dbMessage: Tables<"request_messages"> = {
    id,
    sender: session.user.id,
    conversation_request: conversation,
    content,
    created_at: createdAt,
  };

  const { data, error } = await supabase
    .from("request_messages")
    .insert(dbMessage)
    .select("*")
    .limit(1)
    .order("id")
    .single();

  if (error) {
    console.error("Failed to send req message: ", { dbMessage, error });
    throw error;
  }

  return data;
};

export const sendMessageToStore = async (
  store: WritableLoadable<RequestMessage[]>,
  content: string,
  conversation: string,
  session: Session,
) => {
  const newMessage: RequestMessage = {
    content,
    createdAt: getNow(),
    id: crypto.randomUUID(),
    conversationRequest: conversation,
    sender: session.user.id,
  };
  store.update((messages) => [...messages, newMessage]);
  return true;
};

const newMessageListener = async (
  store: WritableLoadable<RequestMessage[]>,
  payload: RealtimePostgresInsertPayload<{
    [key: string]: any;
  }>,
) => {
  const newMessage = payload.new as Tables<"request_messages">;
  const formatted = formatRequestMessage(newMessage);
  const storeValues = await store.load();
  const exists = storeValues.find((m) => m.id === formatted.id);
  if (!exists) store.update((messages) => [...messages, formatted]);
};

export const initChat = (
  conversationId: string,
  supabase: SupabaseClient<Database>,
  session: Session | null,
  loadMore = 0,
): WritableLoadable<RequestMessage[]> => {
  const chatStore = asyncWritable<[], RequestMessage[]>(
    [],
    () => getMessages(supabase, conversationId, loadMore),
    async (messages) => {
      await persistMessage(messages, supabase, session);
    },
    false,
  );

  supabase
    .channel("schema-db-changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
      },
      (payload) => newMessageListener(chatStore, payload),
    )
    .subscribe();

  return chatStore;
};

const persistMessage = async (
  message: RequestMessage[],
  supabase: SupabaseClient<Database>,
  session: Session | null,
) => {
  if (!session) return;
  const newMessage = message.at(-1);
  if (!newMessage) return;

  // only persist your own messages
  if (newMessage.sender === session.user.id) {
    const formattedMessage = { id: newMessage.id, sender: newMessage.sender, content: newMessage.content, createdAt: newMessage.createdAt, conversation: newMessage.conversationRequest };
    await sendMessage(supabase, formattedMessage, session);
  }
};
