import type {
  ConversationBase,
  ConversationWithReferences,
  DbConversationBase,
  DbConversationWithReferences,
} from "../../models/conversation";
import { formatProfile } from "../profile/utils";

export const formatConversationBase = ({
  id,
  created_at,
  has_replied,
  student,
  teacher,
}: DbConversationBase): ConversationBase => {
  return {
    id,
    createdAt: created_at,
    hasReplied: has_replied,
    student,
    teacher,
  };
};

export const formatConversationWithReferences = ({
  id,
  created_at,
  has_replied,
  student,
  teacher,
}: DbConversationWithReferences): ConversationWithReferences => {
  return {
    id,
    createdAt: created_at,
    hasReplied: has_replied,
    student: formatProfile(student),
    teacher: formatProfile(teacher),
  };
};
