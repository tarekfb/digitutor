import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from 'src/supabase';
import { writable } from 'svelte/store'

let initMessageCount = 25;

// const message: Tables<"messages"> = {
//     created_at: "2024-05-24T09:30:01.376+00:00",
//     sender: "20311e41-1df6-4ca4-844b-a8004dc495d9",
//     conversation: "d214a0e2-6e35-4a0d-b284-cae8bff45d06",
//     content: "Hej från store",
//     id: "0cc9b9ed-78cb-40c7-a5da-5070de1ef0a2"
// };

// const message2: Tables<"messages"> = {
//     created_at: "2024-05-24T09:30:01.376+00:00",
//     sender: "20341e41-1df6-4ca4-844b-a8004dc495d9",
//     conversation: "d214a0e2-6e35-4a0d-b284-cae8bff45d06",
//     content: "Hej från store",
//     id: "0cc9b9ed-78cb-40c7-a5da-5070de1ef0a2"
// };

export const getMessages = async (
    supabase: SupabaseClient<Database>,
    conversationId: string,
    isLoadMore: boolean = false
): Promise<Tables<"messages">[]> => {
    let query = supabase
        .from("messages")
        .select('*')
        .eq("conversation", conversationId)

    if (!isLoadMore)
        query.limit(initMessageCount)
    else
        query.limit((initMessageCount += 5))

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

export const loadChat = async (conversationId: string, supabase: SupabaseClient<Database>) => {
    try {
        const messages = await getMessages(supabase, conversationId)
        chat.set(messages)
    } catch (e) {
        console.error(e);
        // todo setflash if error
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

export const loadMore = async (conversationId: string, supabase: SupabaseClient<Database>) => {
    try {
        const messages = await getMessages(supabase, conversationId, true)
        // chat.set(messages)
        loadChat(conversationId, supabase);
    } catch (e) {
        console.error(e);
        // todo setflash if error
    }
}