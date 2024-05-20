import type { SupabaseClient } from "@supabase/supabase-js";
import type { InputListing, Listing } from "$lib/models/listing";
import type { Database, Tables } from "src/supabase"

export const getListings = async (
  supabase: SupabaseClient<Database>,
  max?: number,
  userId?: string,
  visible?: boolean,
): Promise<Listing[] | null> => {
  let query = supabase
    .from("listings")
    .select(
      `
            *,
            profile (
              *
            )
          `,
    );

  if (userId) query = query.eq("profile", userId)
  if (visible) query = query.eq("visible", visible)
  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.log(`Failed to read listings ${userId ? "for userId" + userId : ''}`, { error });
    throw error;
  }

  return data as unknown as Listing[] | null;
}

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
    console.log("Failed to read listing: " + id, { error });
    throw error;
  }

  return data as unknown as Listing | null;
};

export const createListing = async (
  supabase: SupabaseClient<Database>,
  title: string,
): Promise<Listing> => {
  const session = await supabase.auth.getSession();

  if (!session.data.session) {
    console.log("Missing session when creating listing: ", { title });
    throw new Error("No session");
  }

  const userId = session.data.session.user.id;
  const listingId = crypto.randomUUID();

  const dbListing: Tables<"listings"> = {
    id: listingId,
    title: title,
    hourlyPrice: 0,
    created_at: new Date().toDateString(),
    updated_at: null,
    currency: "SEK",
    description: "",
    subjects: [],
    profile: userId,
    visible: false
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

  return data as unknown as Listing;
};


export const deleteListing = async (
  supabase: SupabaseClient<Database>,
  listingId: string,
): Promise<void> => {
  const session = await supabase.auth.getSession();

  if (!session.data.session) {
    console.log("Missing session when deleting listing: ", { listingId });
    throw new Error("No session");
  }

  const userId = session.data.session.user.id;

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)
    .eq('profile', userId); // for safety measure check userId as well

  if (error) {
    console.log("Failed to delete listing: " + listingId, { error });
    throw error;
  }
};

export const updateListing = async (
  supabase: SupabaseClient<Database>,
  input: InputListing,
  listingId: string
): Promise<Listing> => {

  const { data, error } = await supabase
    .from("listings")
    .update({ ...input, updated_at: new Date().toDateString() })
    .eq("id", listingId)
    .select(
      `
    *,
    profile (
      *
    )
  `,
    )

  if (error) {
    console.log("Failed to update listing", { error });
    throw error;
  }

  if (data === null) {
    console.log("Failed to update listing. Listing is null.", { data, error });
    throw error;
  }

  return data as unknown as Listing;
};