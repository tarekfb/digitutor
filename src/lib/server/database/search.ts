import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "lucide-svelte";
import type { Listing } from "src/lib/shared/models/listing";

export const search = async (
  supabase: SupabaseClient<Database>,
  query: string,
): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from('listings')
    .select(
      `
      *,
      profile (
        *
      )
    `).eq('visible', true)
    .textSearch('compound_search', query)

  if (error) {
    console.error(`Error on search. Query: ${query}`, { error });
    throw error;
  }

  return data as unknown as Listing[];
};