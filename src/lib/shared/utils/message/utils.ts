import type { Tables } from "src/supabase";
import type { Message } from "../../models/conversation";
import type { RequestMessage } from "../../models/conversation-request";

export const formatMessage = ({
  id,
  sender,
  content,
  created_at,
  conversation,
}: Tables<"messages">): Message => ({
  id,
  sender,
  content,
  createdAt: created_at,
  conversation,
});


export const formatRequestMessage = ({
  id,
  sender,
  content,
  created_at,
  conversation_request,
}: Tables<"request_messages">): RequestMessage => ({
  id,
  sender,
  content,
  createdAt: created_at,
  conversationRequest: conversation_request,
});
