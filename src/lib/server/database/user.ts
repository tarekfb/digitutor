import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "lucide-svelte";

export const updateUserEmail = async (
  supabase: SupabaseClient<Database>,
  email: string,
) => {
  const { error, data } = await supabase.auth.updateUser({ email });

  // this error takes presence of email in use and presumably more errors
  if (error?.status === 429) {
    console.error("Email rate limit exceeded", error);
    throw new Error("Email rate limit exceeded");
  }

  if (error) {
    console.error("Supabase error on signup", { error });
    throw error;
  }

  if (!data.user) {
    console.error("User data was null on signup", error);
    throw new Error("Unexpected null response");
  }

  // https://github.com/orgs/supabase/discussions/1282
  if (data.user.identities && data.user.identities.length === 0)
    throw new Error("Email already exists");

  return data;
};
