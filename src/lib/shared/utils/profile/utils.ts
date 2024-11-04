import type { DbDisplayProfile, DisplayProfile } from "../../models/review";

export const formatDisplayProfile = ({ id, first_name, last_name, avatar_url, avg_rating, subjects }: DbDisplayProfile): DisplayProfile => {
    return {
        id,
        firstName: first_name,
        lastName: last_name,
        avatarUrl: avatar_url,
        avgRating: avg_rating || 0,
        subjects,
    };
}