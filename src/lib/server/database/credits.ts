import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "src/supabase";

export const getCreditsByUser = async (
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<number> => {
  const { data, error } = await supabase
    .from("credits")
    .select(`credits`)
    .eq("id", userId)
    .single();

  if (error) {
    console.error(`Failed to get credits for userId: ${userId}`, { error });
    throw error;
  }

  return data;
};

export const updateCredits = async (
  supabase: SupabaseClient<Database>,
  userId: string,
  credits: number,
): Promise<void> => {

  const { data, error } = await supabase
    .rpc('update_credits', { userId, countvalue: credits })

  if (error) {
    console.error(`Failed to update credits for userId: ${userId}`, {
      error,
    });
    throw error;
  }

  return data;
};
