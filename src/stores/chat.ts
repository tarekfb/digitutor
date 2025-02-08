import { asyncWritable, type WritableLoadable } from "@square/svelte-store";
import type {
  RealtimePostgresInsertPayload,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";
import type { Database, Tables } from "src/supabase.ts";
import { initMessagesCount } from "$lib/shared/constants/constants.ts";
import {
  formatMessage,
  type InputMessage,
  type Message,
} from "src/lib/shared/models/conversation.ts";
import { getNow } from "src/lib/shared/utils/utils.ts";

export const getMessages = async (
  supabase: SupabaseClient<Database>,
  conversationId: string,
  loadMore = 0,
): Promise<Message[]> => {
  let initCount = initMessagesCount;
  const query = supabase
    .from("messages")
    .select("*")
    .eq("conversation", conversationId)
    .order("created_at", { ascending: true })
    .limit((initCount += loadMore));

  const { data, error } = await query;

  if (error) {
    console.error(
      `Failed to fetch messages for conversationId: ${conversationId}`,
      { error },
    );
    throw error;
  }

  return data.map((message) => formatMessage(message));
};

export const sendMessage = async (
  supabase: SupabaseClient<Database>,
  { createdAt, content, id, conversation }: Message,
  session: Session,
): Promise<Tables<"messages">> => {
  const dbMessage: Tables<"messages"> = {
    id,
    sender: session.user.id,
    conversation,
    content,
    created_at: createdAt,
  };

  const { data, error } = await supabase
    .from("messages")
    .insert(dbMessage)
    .select("*")
    .limit(1)
    .order("id")
    .single();

  if (error) {
    console.error("Failed to send message: ", { dbMessage, error });
    throw error;
  }

  return data;
};

export const sendMessageToStore = async (
  store: WritableLoadable<Message[]>,
  content: string,
  conversation: string,
  session: Session,
) => {
  const newMessage: Message = {
    content,
    createdAt: getNow(),
    id: crypto.randomUUID(),
    conversation,
    sender: session.user.id,
  };
  store.update((messages) => [...messages, newMessage]);
  return true;
};

const newMessageListener = async (
  store: WritableLoadable<Message[]>,
  payload: RealtimePostgresInsertPayload<{
    [key: string]: any;
  }>,
) => {
  const newMessage = payload.new as Tables<"messages">;
  const formatted = formatMessage(newMessage);
  const storeValues = await store.load();
  const exists = storeValues.find((m) => m.id === formatted.id);
  if (!exists) store.update((messages) => [...messages, formatted]);
};

export const initChat = (
  conversationId: string,
  supabase: SupabaseClient<Database>,
  session: Session | null,
  loadMore = 0,
): WritableLoadable<Message[]> => {
  const chatStore = asyncWritable<[], Message[]>(
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
  message: Message[],
  supabase: SupabaseClient<Database>,
  session: Session | null,
) => {
  if (!session) return;
  const newMessage = message.at(-1);
  if (!newMessage) return;

  // only persist your own messages
  if (newMessage.sender === session.user.id)
    await sendMessage(supabase, newMessage, session);
};
