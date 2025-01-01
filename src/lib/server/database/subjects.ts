import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "lucide-svelte";
import { languages } from "src/lib/shared/models/common";
import type { DbSubject, Subject } from "src/lib/shared/models/subject";
import type { Tables } from "src/supabase";

export const getSubjects = async (
  supabase: SupabaseClient<Database>,
): Promise<DbSubject[]> => {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, title, alt_title")
    .order("title", { ascending: true });

  if (error) {
    console.error(`Error on getting subjects`, { error });
    throw error;
  }
  
  return data as unknown as DbSubject[];
};

export const suggestSubject = async (
  supabase: SupabaseClient<Database>,
  profileId: string,
  subject: string,
  email?: string,
): Promise<Tables<"subjects_suggestions">> => {
  const suggestion = {
    title: subject,
    sender: profileId,
    email,
  };
  const { data, error } = await supabase
    .from("subjects_suggestions")
    .insert(suggestion)
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error(`Error on suggesting subject`, { error });
    throw error;
  }

  return data as unknown as Tables<"subjects_suggestions">;
};
