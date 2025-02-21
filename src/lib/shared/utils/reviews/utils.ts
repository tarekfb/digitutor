import type {
  DbReviewWithReferences,
  ReviewWithReferences,
} from "../../models/review.ts";
import { formatProfile } from "../profile/utils.ts";

export const formatReviewWithReferences = ({
  id,
  created_at,
  description,
  rating,
  receiver,
  sender,
}: DbReviewWithReferences): ReviewWithReferences => {
  return {
    id,
    createdAt: created_at,
    description: description ?? "",
    rating,
    receiver: formatProfile(receiver),
    sender: sender ? formatProfile(sender) : undefined,
  };
};
