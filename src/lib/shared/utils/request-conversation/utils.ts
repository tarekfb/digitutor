import type { DbConversationRequestBase, ConversationRequestBase, DbConversationRequestWithReferences, ConversationRequestWithReferences } from "../../models/conversation-request";
import { formatProfile } from "../profile/utils";

export const formatRequestConversationBase = ({
  id,
  created_at,
  status,
  student,
  teacher,
}: DbConversationRequestBase): ConversationRequestBase => {
  return {
    id,
    createdAt: created_at,
    status,
    student,
    teacher,
  };
};

export const formatConversationRequestWithReferences = ({
  id,
  created_at,
  status,
  student,
  teacher,
}: DbConversationRequestWithReferences): ConversationRequestWithReferences => {
  return {
    id,
    createdAt: created_at,
    status,
    student: formatProfile(student),
    teacher: formatProfile(teacher),
  };
};
