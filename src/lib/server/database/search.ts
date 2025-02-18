import type { SupabaseClient } from "@supabase/supabase-js";
import type { DbSearchResult } from "src/lib/shared/models/listing.ts";
import type { Database } from "src/supabase.ts";

export const search = async (
  supabase: SupabaseClient<Database>,
  inputQuery: string,
): Promise<DbSearchResult[]> => {
  const dbQuery = supabase.from("searchable_listings").select("*");
  if (inputQuery) {
    inputQuery = inputQuery
      .trim()
      .split(" ")
      .map((word) => `'${word}'`)
      .join(" | ");
    // https://supabase.com/docs/guides/database/full-text-search?queryGroups=language&language=js#match-all-search-words
    dbQuery.textSearch("compound_search", inputQuery);
  }
  const { data, error } = await dbQuery;

  if (error) {
    console.error(`Error on search. Query: ${inputQuery}`, { error });
    throw error;
  }

  console.log("data was", { data });
  console.log({ inputQuery });

  return data as unknown as DbSearchResult[];
};