import { isAuthApiError, type AuthTokenResponse, type EmailOtpType } from "@supabase/supabase-js";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";
import { defaultErrorInfo } from "src/lib/shared/constants/constants";

// export const GET2: RequestHandler = async ({ url, locals: { supabase } }) => {
//   const code = url.searchParams.get("code");
//   let authToken: AuthTokenResponse | undefined;
//   if (code) {
//     try {
//       authToken = await supabase.auth.exchangeCodeForSession(code);
//     } catch (e) {
//       // If you open in another browser, exchangeCodeForSession fails
//       if (isAuthApiError(e)) redirect(303, "/forgot-password?wrongBrowser=true")
//       else error(500, { ...defaultErrorInfo });
//     }
//   }

//   if (!authToken?.data) redirect(303, "/link-not-valid-error")

//   const next = url.searchParams.get("next");
//   if (next) redirect(303, next);

//   if (authToken?.data) redirect(303, "/account");

//   redirect(303, "/link-not-valid-error")
// };

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const token_hash = url.searchParams.get('token_hash') as string
  const type = url.searchParams.get('type') as EmailOtpType | null
  const next = url.searchParams.get('next') ?? '/'

  /**
   * Clean up the redirect URL by deleting the Auth flow parameters.
   *
   * `next` is preserved for now, because it's needed in the error case.
   */
  const redirectTo = new URL(url)
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) {
      redirectTo.searchParams.delete('next')
      redirect(303, redirectTo)
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/link-not-valid-error'
  redirect(303, redirectTo)
}