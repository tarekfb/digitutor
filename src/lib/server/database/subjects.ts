import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "lucide-svelte";
import type { DbSubject } from "src/lib/shared/models/subject";

export const getSubjects = async (
  supabase: SupabaseClient<Database>,
): Promise<DbSubject[]> => {
  const { data, error } = await supabase.from('subjects').select('id, title, alt_title').order('title', { ascending: true });

  if (error) {
    console.error(`Error on getting subjects`, { error });
    throw error;
  }

  return data as unknown as DbSubject[];
};