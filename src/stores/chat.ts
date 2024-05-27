import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from 'src/supabase';
import { writable } from 'svelte/store'
import { initMessagesCount as count } from "$lib/constants";


let initMessageCount = count;

export const getMessages = async (
    supabase: SupabaseClient<Database>,
    conversationId: string,
    loadMore = 0
): Promise<Tables<"messages">[]> => {
    let query = supabase
        .from("messages")
        .select('*')
        .eq("conversation", conversationId)
        .order("created_at", { ascending: false })
        .limit(initMessageCount += loadMore)

    const { data, error } = await query;

    if (error) {
        console.error(`Failed to fetch messages for conversationId: ${conversationId}`, { error });
        throw error;
    }

    if (!data) {
        console.error("Failed to get messages. Response was null");
        throw new Error("Unexpected null response");
    }

    return data;
}

export const chat = writable<Tables<"messages">[]>([]);

export const loadChat = async (conversationId: string, supabase: SupabaseClient<Database>, loadMore = 0, initMessages: Tables<"messages">[] = []) => {
    if (initMessages.length > 0) {
        chat.set(initMessages)
    } else {
        try {
            const messages = await getMessages(supabase, conversationId, loadMore)
            chat.set(messages.reverse());
        } catch (e) {
            console.error(e);
            // todo setflash if error
        }
    }

    supabase
        .channel('schema-db-changes')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
        }, () => loadChat(conversationId, supabase)
        )
        .subscribe()
};