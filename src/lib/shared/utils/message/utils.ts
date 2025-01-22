import type { Tables } from "src/supabase";
import type { Message } from "../../models/conversation";

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