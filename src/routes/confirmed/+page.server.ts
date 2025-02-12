import type { EmailOtpType } from "@supabase/supabase-js";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.ts";
import {
  defaultErrorInfo,
  getDefaultErrorInfo,
} from "$lib/shared/constants/constants.ts";

export const load: PageServerLoad = async (event) => {
  const {
    url,
    locals: { supabase },
  } = event;
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  if (!tokenHash || !type) {
    console.error(
      "Issue at confirm signup, mimssing information",
      { tokenHash },
      { type },
    );
    error(500, getDefaultErrorInfo("Det saknas lite info för att verifiera dig"));
  }

  const {
    error: e,
    data: { user },
  } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (e) {
    console.error("Unknown error on verify otp on email confirmation", e);
    redirect(303, "/signup-error");
  }

  if (!user) {
    console.error(
      "User data was null on verify otp on email confirmation",
      e,
    );
    error(500, { ...defaultErrorInfo });
  }

  return { email: user.email };
}