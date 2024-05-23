import type { Tables } from "src/supabase";
import { z } from "zod";

export type Conversation = Omit<Tables<"conversations">, "teacher" | "student"> & {
    teacher: Tables<"profiles">;
    student: Tables<"profiles">;
};

export type InputMessage = Pick<Tables<"messages">, "content" | "conversation">;
export const sendMessageSchema = z.object({
    content: z
        .string()
        .min(1, "Måste vara minst 1 karaktär.")
        .max(300, "Får inte vara mer än 300 karaktärer")
})

export const startConversationSchema = z.object({
    teacher: z
        .string()
})