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
    description: description + `asd asd asd asd asd asd asdasd ad asd asd asd asd asdasd
            ad asd asd asd asd asdasd ad asd asd asd asd asdasd ad asd asd asd asd asdasd
            ad asd asd asd asdasd asd asdfasd asd asdasdasdasd asd d asd asd asd asd
            asdasd ad asd asd asd asd asdasd ad asd asd asd asd asdasd ad asd asd asd
            asd asdasd ad asd asd asd asd asdasd ad asd asd asd asd asdasd ad asd asd
            asd asd asdasd ad asd asd asd asd asdasd aasd asd asd asd asd asd asd asd
            asdasd ad asd asd asd asd asdasd ad asd asd asd asd asdasd ad asd asd asd
            asd asdasd ad asdasd ad asd asd asd asd asdasd ad asd asd asd asd asdasd
            ad asd asd asd asd asdasd ad asd asd asd asd asdasd ad asd asd asd asdasd
            asd asdfasd asd asdasdasdasd asd d asd asd asd asd asdasd ad asd asd asd
            asd asdasd ad asd asd asd asd asdasd ad asd asd asd asd asdasd ad asd asd
            asd asd asdasd ad asd asd asd asd asdasd ad asd asd asd asd asdasd ad asd
            asd asd asd asdasd aasd asd asd asd asd asd asd asd asdasd ad asd asd asd
            asd asdasd ad asd asd asd asd asdasd ad asd asd asd asd asdasd ad asd asd
            asd asd asdasd ad asd asd asd asdasd asd asdfasd asd asdsd asdasd asd asdfasd
            asd asd`,
    rating,
    receiver: formatProfile(receiver),
    sender: sender ? formatProfile(sender) : undefined,
  };
};
