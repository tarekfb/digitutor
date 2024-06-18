import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { InputListing, Listing } from "$lib/shared/models/listing";
import type { Database, Tables } from "src/supabase"
import { getNow } from '$lib/utils'

export const getListings = async (
  supabase: SupabaseClient<Database>,
  max?: number,
  userId?: string,
  visible?: boolean,
): Promise<Listing[]> => {
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
  if (visible) query = query.eq("visible", true)
  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.error(`Failed to read listings ${userId ? "for userId" + userId : ''}`, { error });
    throw error;
  }

  if (!data) {
    console.error(`Failed to get listings. Response was null`);
    throw new Error("Unexpected null response");
  }

  return data as unknown as Listing[];
}

export const getListingsByTeacherId = async (
  supabase: SupabaseClient<Database>,
  teacherId: string,
  max?: number,
  visible?: boolean,
): Promise<Listing[]> => {

  let query = supabase
    .from("listings")
    .select(
      `
            *,
            profile (
              *
            )
          `,
    )
    .eq("profile", teacherId)

  if (visible) query = query.eq("visible", visible)
  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.error(`Failed to read listings ${teacherId ? "for userId" + teacherId : ''}`, { error });
    throw error;
  }

  if (!data) {
    console.error(`Failed to get listings for teacher ${teacherId}. Response was null`);
    throw new Error("Unexpected null response");
  }

  return data as unknown as Listing[];
}

export const getListing = async (
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
    console.error("Failed to read listing: " + id, { error });
    throw error;
  }

  return data as unknown as Listing;
};

export const createListing = async (
  supabase: SupabaseClient<Database>,
  title: string,
  session: Session,
): Promise<Listing> => {
  const dbListing: Tables<"listings"> = {
    id: crypto.randomUUID(),
    title: title,
    hourlyPrice: 0,
    created_at: getNow(),
    updated_at: null,
    currency: "SEK",
    description: "",
    subjects: [],
    profile: session.user.id,
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
    console.error("Failed to create listing: ", { dbListing, error });
    throw error;
  }

  if (!data) {
    console.error("Failed to create listing. Response was null");
    throw new Error("Unexpected null response");
  }

  return data as unknown as Listing;
};


export const deleteListing = async (
  supabase: SupabaseClient<Database>,
  listingId: string,
  session: Session,
): Promise<Tables<"listings">> => {
  const { error, data } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)
    .eq('profile', session.user.id)
    .select('*')
    .limit(1)
    .order('id')
    .single();

  if (error) {
    console.error("Failed to delete listing: " + listingId, { error });
    throw error;
  }

  if (!data) {
    console.error("Failed to delete listing. Response was null");
    throw new Error("Unexpected null response");
  }

  return data;
};

export const updateListing = async (
  supabase: SupabaseClient<Database>,
  input: InputListing,
  listingId: string,
  session: Session,
): Promise<Listing> => {

  const { data, error } = await supabase
    .from("listings")
    .update({ ...input, updated_at: getNow() })
    .eq("id", listingId)
    .eq('profile', session.user.id)
    .select(
      `
      *,
      profile (
        *
      )
    `)
    .limit(1)
    .order('id')
    .single();

  if (error) {
    console.error("Failed to update listing", { error });
    throw error;
  }

  if (!data) {
    console.error("Failed to update listing. Response was null.");
    throw new Error("Unexpected null response");
  }

  return data as unknown as Listing;
};