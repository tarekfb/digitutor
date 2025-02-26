import type { EmailOtpType } from "@supabase/supabase-js";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.ts";
import {
  defaultErrorInfo,
  getDefaultErrorInfo,
} from "$lib/shared/constants/constants.ts";
import { logError } from "src/lib/shared/utils/logging/utils.ts";

export const load: PageServerLoad = async (event) => {
  const {
    url,
    locals: { supabase },
  } = event;
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  if (!tokenHash || !type) {
    logError({
      message: "Issue at confirm signup, missing information",
      additionalData: { tokenHash, type, url },
      critical: true,
    });
    error(500, getDefaultErrorInfo("Det saknas lite info för att verifiera dig"));
  }

  const {
    error: e,
    data: { user },
  } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (e) {
    logError({
      message: "Unknown error on verify otp on email confirmation", error: e, additionalData: { tokenHash, type, url, user }, critical: true,
    });
    redirect(303, "/signup-error");
  }

  if (!user) {
    logError({
      message: "User data was null on verify otp on email confirmation",
      additionalData: { tokenHash, type, url, user },
      critical: true,
      error: e,
    });
    error(500, { ...defaultErrorInfo });
  }

  return { email: user.email };
}
