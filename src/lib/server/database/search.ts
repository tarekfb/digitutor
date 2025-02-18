import type { SupabaseClient } from "@supabase/supabase-js";
import type {  DbSearchResult } from "src/lib/shared/models/listing.ts";
import type { Database } from "src/supabase.ts";

export const search = async (
  supabase: SupabaseClient<Database>,
  query: string,
): Promise<DbSearchResult[]> => {
  query = query
    .trim()
    .split(" ")
    .map((word) => `'${word}'`)
    .join(" | ");
  // https://supabase.com/docs/guides/database/full-text-search?queryGroups=language&language=js#match-all-search-words

  const { data, error } = await supabase
    .from("searchable_listings")
    .select("*")
    .textSearch("compound_search", query);

  if (error) {
    console.error(`Error on search. Query: ${query}`, { error });
    throw error;
  }

  return data as unknown as DbSearchResult[];
};

export const getAll = async (supabase: SupabaseClient<Database>): Promise<DbSearchResult[]> => {
  const { data, error } = await supabase.from("searchable_listings").select("*");

  console.log(data);
  if (error) {
    console.error(`Error on search get all`, { error });
    throw error;
  }
  return data as unknown as DbSearchResult[];
}