import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type {
  InputListing,
  DbListingWithProfile,
} from "$lib/shared/models/listing";
import type { Database, Tables } from "src/supabase";
import { getNow } from "src/lib/shared/utils/utils";
import { ResourceNotFoundError } from "src/lib/shared/errors/missing-error";

export const getListings = async (
  supabase: SupabaseClient<Database>,
  max?: number,
  teacherId?: string,
  visible?: boolean,
): Promise<DbListingWithProfile[]> => {
  let query = supabase.from("listings").select(
    `
            *,
            profile (
              *
            )
          `,
  );

  if (teacherId) query = query.eq("profile", teacherId);
  if (visible) query = query.eq("visible", true);
  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.error(
      `Failed to read listings ${teacherId ? "for teacher " + teacherId : ""}`,
      { error },
    );
    throw error;
  }

  return data as unknown as DbListingWithProfile[];
};

export const getListingsByTeacher = async (
  supabase: SupabaseClient<Database>,
  teacherId: string,
  max?: number,
  visible?: boolean,
): Promise<DbListingWithProfile[]> => {
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
    .eq("profile", teacherId);

  if (visible) query = query.eq("visible", visible);
  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.error(
      `Failed to read listings ${teacherId ? "for userId" + teacherId : ""}`,
      { error },
    );
    throw error;
  }

  return data as unknown as DbListingWithProfile[];
};

export const getListing = async (
  supabase: SupabaseClient<Database>,
  id: string,
  visible?: boolean,
): Promise<DbListingWithProfile> => {
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

  if (visible && !data.visible)
    throw new ResourceNotFoundError(400, `Listing ${data.id} is not visible`);

  return data as unknown as DbListingWithProfile;
};

export const createListing = async (
  supabase: SupabaseClient<Database>,
  title: string,
  session: Session,
): Promise<DbListingWithProfile> => {
  const dbListing: Tables<"listings"> = {
    id: crypto.randomUUID(),
    title: title,
    hourly_price: 0,
    created_at: getNow(),
    updated_at: null,
    currency: "SEK",
    description: "",
    subjects: [],
    profile: session.user.id,
    visible: false,
  };

  const { data, error } = await supabase
    .from("listings")
    .insert(dbListing)
    .select(
      `
    *,
    profile(
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

  return data as unknown as DbListingWithProfile;
};

export const deleteListing = async (
  supabase: SupabaseClient<Database>,
  listingId: string,
  session: Session,
): Promise<Tables<"listings">> => {
  const { error, data } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId)
    .eq("profile", session.user.id)
    .select("*")
    .limit(1)
    .order("id")
    .single();

  if (error) {
    console.error("Failed to delete listing: " + listingId, { error });
    throw error;
  }

  return data;
};

export const updateListing = async (
  supabase: SupabaseClient<Database>,
  input: InputListing,
  listingId: string,
  session: Session,
): Promise<DbListingWithProfile> => {
  const dbListing = {
    id: listingId,
    title: input.title,
    hourly_price: input.hourlyPrice,
    description: input.description,
    subjects: input.subjects,
    visible: input.visible,
    updated_at: getNow(),
  };

  const { data, error } = await supabase
    .from("listings")
    .update({ ...dbListing })
    .eq("id", listingId)
    .eq("profile", session.user.id)
    .select(
      `
    *,
    profile(
        *
      )
      `,
    )
    .limit(1)
    .order("id")
    .single();

  if (error) {
    console.error("Failed to update listing", { error });
    throw error;
  }

  return data as unknown as DbListingWithProfile;
};
