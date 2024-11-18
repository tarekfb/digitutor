import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "lucide-svelte";
import type { DbListingWithProfile } from "src/lib/shared/models/listing";

export const search = async (
  supabase: SupabaseClient<Database>,
  query: string,
): Promise<DbListingWithProfile[]> => {

  query = query
    .trim()
    .split(' ')
    .map(word => `'${word}'`)
    .join(' | ');
  // https://supabase.com/docs/guides/database/full-text-search?queryGroups=language&language=js#match-all-search-words

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

  return data as unknown as DbListingWithProfile[];
};