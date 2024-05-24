import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from 'src/supabase';
import { writable } from 'svelte/store'

const message: Tables<"messages"> = {
    created_at: "2024-05-24T09:30:01.376+00:00",
    sender: "20311e41-1df6-4ca4-844b-a8004dc495d9",
    conversation: "d214a0e2-6e35-4a0d-b284-cae8bff45d06",
    content: "Hej från store",
    id: "0cc9b9ed-78cb-40c7-a5da-5070de1ef0a2"
};

const message2: Tables<"messages"> = {
    created_at: "2024-05-24T09:30:01.376+00:00",
    sender: "20341e41-1df6-4ca4-844b-a8004dc495d9",
    conversation: "d214a0e2-6e35-4a0d-b284-cae8bff45d06",
    content: "Hej från store",
    id: "0cc9b9ed-78cb-40c7-a5da-5070de1ef0a2"
};

const messages: Tables<"messages">[] = [];

export const chat = writable<Tables<"messages">[]>(messages)
const loadChat = () => chat.set(messages);
export const reset = () => {
    messages.splice(0, messages.length);
    loadChat();
};
export const sendMessage = () => {
    messages.push(messages.length % 2 === 0 ? message : message2)
    loadChat()
}