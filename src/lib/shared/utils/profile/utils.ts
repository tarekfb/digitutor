import type { DbProfile, Profile } from "../../models/profile.ts";
// import type { DbDisplayProfile, DisplayProfile } from "../../models/review.ts";

// export const formatDisplayProfile = ({
//   id,
//   first_name,
//   avatar_url,
//   avg_rating,
//   subjects,
// }: DbDisplayProfile): DisplayProfile => {
//   return {
//     id,
//     firstName: first_name,
//     avatarUrl: avatar_url,
//     avgRating: avg_rating || 0,
//     subjects,
//   };
// };

export const formatProfile = ({
  id,
  role,
  first_name,
  avatar_url,
  bio,
}: DbProfile): Profile => {
  if (role === "admin") throw new Error("Unsupported role");

  return {
    id,
    role,
    firstName: first_name,
    avatarUrl: avatar_url ?? undefined,
    bio,
  };
};

export const hasFullProfile = (profile: Profile | null) => {
  if (!profile) return false;

  if (!profile.firstName) return false;

  return true;
};
