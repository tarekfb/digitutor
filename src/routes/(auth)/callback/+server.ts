import { isAuthApiError, type AuthTokenResponse } from "@supabase/supabase-js";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";
import { defaultErrorInfo } from "src/lib/shared/constants/constants";

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code");
  let authToken: AuthTokenResponse | undefined;
  if (code) {
    try {
      authToken = await supabase.auth.exchangeCodeForSession(code);
    } catch (e) {
      // If you open in another browser, need to redirect to login
      // Should not display error
      if (isAuthApiError(e)) redirect(303, "/sign-in?verified=true")
      else error(500, { ...defaultErrorInfo });
    }
  }

  const next = url.searchParams.get("next");
  if (next) redirect(303, next);

  if (authToken?.data.session) redirect(303, "/account");
  else redirect(303, "/link-not-valid-error")
};