import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "lucide-svelte";
import type { Listing } from "src/lib/shared/models/listing";
import type { Tables } from "src/supabase";

export const searchTeachers = async (
  supabase: SupabaseClient<Database>,
  query: string,
): Promise<Tables<"profiles">[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('role', 'teacher')
    .textSearch('searchable_teacher', query)

  if (error) {
    console.error(`Error on search. Query: ${query}`, { error });
    throw error;
  }

  return data as unknown as Tables<"profiles">[]; // ts doesnt understand the query
};
export const searchListings = async (
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
    .textSearch('searchable_listing', query)

  if (error) {
    console.error(`Error on search. Query: ${query}`, { error });
    throw error;
  }

  return data as unknown as Listing[];
};