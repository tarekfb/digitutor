import { asyncWritable, type WritableLoadable } from "@square/svelte-store";
import type { RealtimePostgresInsertPayload, Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from 'src/supabase';
import { initMessagesCount } from "$lib/shared/constants/constants";
import { formatMessage, type InputMessage, type Message } from "src/lib/shared/models/conversation";
import { getNow } from "src/lib/shared/utils/utils";

export const getMessages = async (
    supabase: SupabaseClient<Database>,
    conversationId: string,
    loadMore = 0
): Promise<Message[]> => {
    let initCount = initMessagesCount;
    const query = supabase
        .from("messages")
        .select('*')
        .eq("conversation", conversationId)
        .order("created_at", { ascending: true })
        .limit(initCount += loadMore)

    const { data, error } = await query;

    if (error) {
        console.error(`Failed to fetch messages for conversationId: ${conversationId}`, { error });
        throw error;
    }

    return data.map(message => formatMessage(message));
}

export const sendMessage = async (
    supabase: SupabaseClient<Database>,
    { conversation, content }: InputMessage,
    session: Session
): Promise<Tables<"messages">> => {
    const dbMessage: Tables<"messages"> = {
        id: crypto.randomUUID(),
        sender: session.user.id,
        conversation: conversation,
        content: content,
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

    return data;
}

export const initChat = (conversationId: string, supabase: SupabaseClient<Database>, session: Session | null, loadMore = 0): WritableLoadable<Message[]> => {
    const chatStore = asyncWritable<[], Message[]>(
        [],
        () => getMessages(supabase, conversationId, loadMore),
        async (messages) => {
            persistMessage(messages, supabase, session);
        },
        false
    );

    const newMessageListener = (payload: RealtimePostgresInsertPayload<{
        [key: string]: any;
    }>) => {
        const newMessage = payload.new as Tables<"messages">;
        const formatted = formatMessage(newMessage);
        chatStore.update((messages) => {
            console.log("running update on new message listener")
            console.log("new message is: ", formatted);
            console.log("last message is : ", messages.at(-1));
            console.log("find", messages.find((m) => m.id === formatted.id));
            console.log("messages", messages)
            // if (messages.find((m) => m.id === formatted.id)) return messages;
            // return [...messages, formatted];
            return [...messages]
        });
    }

    supabase
        .channel('schema-db-changes')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
        }, (payload) => newMessageListener(payload)
        )
        .subscribe()

    return chatStore;
};

const persistMessage = async (message: Message[], supabase: SupabaseClient<Database>, session: Session | null) => {
    if (!session) return; // todo: handle error here

    const newMessage = message.at(-1);
    if (!newMessage) return; // todo: handle error here
    const { conversation, content } = newMessage;

    await sendMessage(supabase, { conversation, content }, session);
}
