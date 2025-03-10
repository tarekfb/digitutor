import type {
  DbRating,
  DbReviewWithReferences,
  DbTopTeacher,
  Rating,
  ReviewWithReferences,
  TopTeacher,
} from "../../models/review.ts";
import { formatSubject } from "../../models/subject.ts";
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

export const formatTopTeacher = ({
  id,
  first_name,
  avatar_url,
  avg_rating,
  review_count,
  five_star_reviews_with_description,
  subjects,
  reviews,
}: DbTopTeacher): TopTeacher => {
  return {
    id,
    firstName: first_name,
    avatarUrl: avatar_url ?? undefined,
    avgRating: avg_rating,
    reviewCount: review_count,
    fiveStarReviewsWithDescription: five_star_reviews_with_description,
    subjects: subjects.map(s => formatSubject(s)),
    reviews: reviews.map(r => formatReviewWithReferences(r)),
  };
};

export const formatRating = ({
  id,
  first_name,
  avatar_url,
  review_count,
  avg_rating,
}: DbRating): Rating => {
  return {
    id,
    firstName: first_name,
    avatarUrl: avatar_url ?? undefined,
    reviewCount: review_count,
    avgRating: avg_rating,
  };
};

