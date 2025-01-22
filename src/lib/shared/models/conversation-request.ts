import type { Tables } from "src/supabase";
import { z } from "zod";
import type { Profile } from "./profile";

export type DbConversationRequestBase = Tables<"conversation_requests">;

export type DbConversationRequestWithReferences = Omit<
  Tables<"conversation_requests">,
  "teacher" | "student"
> & {
  teacher: Tables<"profiles">;
  student: Tables<"profiles">;
};

export type ConversationRequestBase = Omit<
  DbConversationRequestBase,
  "created_at" | "updated_at"
> & {
  createdAt: string;
};

export type ConversationRequestWithReferences = Omit<
  ConversationRequestBase,
  "teacher" | "student"
> & {
  teacher: Profile;
  student: Profile;
};

export type InputRequestMessage = Pick<Tables<"request_messages">, "content" | "conversation_request">;

export type RequestMessage = {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
  conversationRequest: string;
};

export const sendRequestMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Måste vara minst 1 karaktär.")
    .max(300, "Får inte vara mer än 300 karaktärer."),
});

const requestContactProperties = {
  teacher: z.string(),
  role: z.string(),
};

export const requestContactSchema = z.object(requestContactProperties);

export const startContactSchema = z.object({
  ...requestContactProperties,
  firstMessage: z
    .string()
    .min(5, "Måste vara minst 5 karaktär.")
    .max(300, "Får inte vara mer än 300 karaktärer."),
});
