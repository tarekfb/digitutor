import type {
  DbListingBase,
  DbListingWithProfile,
  DbSearchResult,
  ListingBase,
  ListingWithProfile,
} from "../../models/listing.ts";
import type { SearchResult } from "../../models/search.ts";
import { formatProfile } from "../profile/utils.ts";

export const formatListingBase = ({
  id,
  title,
  description,
  currency,
  visible,
  subjects,
  hourly_price,
  profile,
  created_at,
  updated_at,
}: DbListingBase): ListingBase => {
  return {
    id,
    title,
    description,
    currency,
    visible,
    hourlyPrice: hourly_price,
    subjects,
    profile,
    createdAt: created_at,
    updatedAt: updated_at ?? undefined,
  };
};

export const formatListingWithProfile = ({
  id,
  title,
  description,
  currency,
  visible,
  subjects,
  hourly_price,
  profile,
  created_at,
  updated_at,
}: DbListingWithProfile): ListingWithProfile => {
  return {
    id,
    title,
    description,
    currency,
    visible,
    hourlyPrice: hourly_price,
    subjects,
    createdAt: created_at,
    updatedAt: updated_at ?? undefined,
    profile: formatProfile(profile),
  };
};

export const formatSearchResult = ({
  id,
  title,
  description,
  subjects,
  hourly_price,
  profile_id,
  first_name,
  avatar_url,
  role,
  avg_rating,
  review_count
}: DbSearchResult): SearchResult => {
  return {
    id,
    title,
    description,
    hourlyPrice: hourly_price,
    subjects,
    avgRating: avg_rating,
    reviewCount: review_count,
    profile: {
      role: role,
      avatarUrl: avatar_url ?? undefined,
      firstName: first_name,
      id: profile_id,
    }
  };
};
