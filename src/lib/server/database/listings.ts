import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "src/supabase";

export type Listing = Omit<Tables<"listings">, 'profile'> & {
  profile?: Tables<"profiles">
};

export const getListings = async (supabase: SupabaseClient<Database>, max?: number): Promise<Listing[] | null> => {
  if (max) {
    const { data: listings } = await supabase
      .from("listings")
      .select(`
            *,
            profile (
              *
            )
          `)
      .limit(max)

    return listings as Listing[] | null;
  }

  const { data: listings } = await supabase
    .from("listings")
    .select(`
        *,
        profile (
          *
        )
      `)

  return listings as Listing[] | null;
};