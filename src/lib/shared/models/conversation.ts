import type { Tables } from "src/supabase";
import { z } from "zod";
import type { Role } from "./profile";

export type Conversation = Omit<Tables<"conversations">, "teacher" | "student"> & {
    teacher: Tables<"profiles">;
    student: Tables<"profiles">;
};

export type InputMessage = Pick<Tables<"messages">, "content" | "conversation">;


export type Message = {
    id: string,
    sender: string,
    content: string,
    createdAt: string,
    conversation: string,
}

export const formatMessage = ({id, sender, content, created_at, conversation}: Tables<"messages">): Message => ({
    id, 
    sender,
    content,
    createdAt: created_at,
    conversation
})

const sendMessageProperties = {
    content: z
        .string()
        .min(1, "Måste vara minst 1 karaktär.")
        .max(300, "Får inte vara mer än 300 karaktärer.")
}
export const sendMessageSchema = z.object(sendMessageProperties)
const requestContactProperties = {
    teacher: z
        .string(),
    role: z
        .string(),
}



export const requestContactSchema = z.object(requestContactProperties)

export const startContactSchema = z.object({
    ...requestContactProperties,
    firstMessage: z
        .string()
        .min(5, "Måste vara minst 5 karaktär.")
        .max(300, "Får inte vara mer än 300 karaktärer.")
})