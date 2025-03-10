import type { Tables } from "src/supabase.ts";
import type { TypeToZod } from "src/lib/shared/utils/utils.ts";
import { z } from "zod";
import type { DbProfile, Profile } from "./profile.ts";

export type DbListingBase = Tables<"listings">;

export type DbListingWithProfile = Omit<Tables<"listings">, "profile"> & {
  profile: DbProfile;
};

export type DbSearchResult = {
  id: DbListingBase["id"];
  title: DbListingBase["title"];
  description: DbListingBase["description"];
  hourly_price: DbListingBase["hourly_price"];
  created_at: DbListingBase["created_at"];
  updated_at: DbListingBase["updated_at"];
  profile_id: DbProfile["id"];
  first_name: DbProfile["first_name"];
  avatar_url: DbProfile["avatar_url"];
  profile_created_at: DbProfile["created_at"];
  profile_updated_at: DbProfile["updated_at"];
  bio: DbProfile["bio"];
  role: DbProfile["role"];
  subjects: DbListingBase["subjects"];
  avg_rating: number;
  review_count: number;
};

export type ListingBase = Omit<
  DbListingBase,
  "created_at" | "updated_at" | "hourly_price"
> & {
  hourlyPrice: number;
  createdAt: string;
  updatedAt?: string;
};

export type ListingWithProfile = Omit<ListingBase, "profile"> & {
  profile: Profile;
};

export type InputListing = Pick<
  DbListingBase,
  "description" | "subjects" | "title" | "visible"
> & {
  hourlyPrice: number;
};

const updateListingProps: TypeToZod<InputListing> = {
  description: z
    .string()
    .min(10, "Måste vara minst 10 karaktärer.")
    .max(400, "Får inte vara mer än 400 karaktärer."),
  hourlyPrice: z.coerce
    .number()
    .min(0, "Måste vara minst 0.")
    .max(100000, "Självinsikt och självsäkerhet är en hårfin balansgång."),
  subjects: z.number().array().min(1, "Du måste välja minst ett ämne."),
  title: z
    .string()
    .min(3, "Måste vara minst 3 karaktärer.")
    .max(80, "Får inte vara mer än 80 karaktärer."),
  visible: z.boolean(),
  // currency: z
  // .string()
  // .length(3, "Valutan måste vara exakt 3 bokstäver.")
  // .refine((s) => s.trim() !== "", "Valutan får inte vara tom.")
  // .refine((s) => /^[A-Za-z]*$/.test(s), "Valutan får inte innehålla mellanslag."),
};

export const updateListingSchema = z.object(updateListingProps);

export const initCreateListingSchema = z.object({
  title: updateListingProps.title,
  nbrOfListings: z.number(),
});
