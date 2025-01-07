import { isAuthApiError } from "@supabase/supabase-js";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";
import { defaultErrorInfo } from "src/lib/shared/constants/constants";

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code");
  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (e) {
      // If you open in another browser, need to redirect to login.
      // Should not display error
      if (isAuthApiError(e)) {
        console.error("AUTH ERROR")
        error(500, { ...defaultErrorInfo });
      } else {
        console.error("NOT AUTH ERROR BUT ERROR")
        error(500, { ...defaultErrorInfo });
      }
    }
  }

  const next = url.searchParams.get("next");
  if (next) {
    throw redirect(303, next);
  }
  
  throw redirect(303, "/account");
};