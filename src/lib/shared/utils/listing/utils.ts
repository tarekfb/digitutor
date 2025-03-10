import type {
  DbListingBase,
  DbListingWithProfile,
  ListingBase,
  ListingWithProfile,
} from "../../models/listing.ts";
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

