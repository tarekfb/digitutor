import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "src/supabase";
import { getProfileByUserId } from "$lib/server/database/profiles";

export type Listing = Omit<Tables<"listings">, "profile"> & {
  profile?: Tables<"profiles">;
};

export const getListings = async (
  supabase: SupabaseClient<Database>,
  max?: number,
): Promise<Listing[] | null> => {
  if (max) {
    const { data: listings } = await supabase
      .from("listings")
      .select(
        `
            *,
            profile (
              *
            )
          `,
      )
      .limit(max);

    return listings as Listing[] | null;
  }

  const { data: listings } = await supabase.from("listings").select(`
        *,
        profile (
          *
        )
      `);

  return listings as Listing[] | null;
};

export const getListingById = async (
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<Listing | null> => {
  const { data, error } = await supabase
    .from("listings")

    .select(
      `
            *,
            profile (
              *
            )
          `,
    )
    .eq("id", id)
    .limit(1)
    .single();

  if (error) {
    console.log("Failed to create listing: " + id, { error });
    throw error;
  }

  return data as unknown as Listing | null;
};

export const createListing = async (
  supabase: SupabaseClient<Database>,
  input: { title: string; hourlyPrice: string },
): Promise<Listing> => {
  const session = await supabase.auth.getSession();

  if (!session.data.session) {
    console.log("Missing session when creating listing: ", { input });
    throw new Error("No session");
  }

  const userId = session.data.session.user.id;
  const listingId = crypto.randomUUID();

  const dbListing: Tables<"listings"> = {
    id: listingId,
    title: input.title,
    hourlyPrice: Number(input.hourlyPrice),
    created_at: new Date().toDateString(),
    updated_at: null,
    currency: "SEK",
    description: null,
    subjects: [],
    profile: userId,
  };

  const { data, error } = await supabase
    .from("listings")
    .insert(dbListing)
    .select(
      `
    *,
    profile (
      *
    )
  `,
    )
    .limit(1)
    .single();

  if (error) {
    console.log("Failed to create listing: ", { dbListing, error });
    throw error;
  }

  if (data === null) {
    console.log("Failed to create listing. Listing is null.", {
      dbListing,
      error,
    });
    throw error;
  }

  console.log(data);

  // const listing = addProfileToListing(supabase, data);
  return data as unknown as Listing;
};

// const addProfileToListing = async (supabase: SupabaseClient<Database>, dbListing: Tables<"listings">): Promise<Listing> => {
//   const profile = await getProfileByUserId(supabase, dbListing.profile);
//   return {
//     ...dbListing,
//     profile: {
//       ...profile
//     }
//   }
// }
