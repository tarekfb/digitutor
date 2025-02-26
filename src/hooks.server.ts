import { createServerClient } from "@supabase/ssr";
import { type Handle } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import { sequence } from "@sveltejs/kit/hooks";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_ENVIRONMENT,
} from "$env/static/public";
import { createClient } from "@supabase/supabase-js";
import { PRIVATE_SUPABASE_SERVICE_ROLE } from "$env/static/private";
import { initCloudflareSentryHandle, sentryHandle } from '@sentry/sveltekit';

const supabase: Handle = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => event.cookies.get(key),
        /**
         * SvelteKit's cookies API requires `path` to be explicitly set in
         * the cookie options. Setting `path` to `/` replicates previous/
         * standard behavior.
         */
        set: (key, value, options) => {
          event.cookies.set(key, value, { ...options, path: "/" });
        },
        remove: (key, options) => {
          event.cookies.delete(key, { ...options, path: "/" });
        },
      },
    },
  );

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    if (!session) {
      return { session: null, user: null };
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    if (error) {
      // JWT validation has failed
      return { session: null, user: null };
    }

    return { session, user };
  };

  event.locals.supabaseServiceRole = createClient(
    PUBLIC_SUPABASE_URL,
    PRIVATE_SUPABASE_SERVICE_ROLE,
    { auth: { persistSession: false } },
  );
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};

const authGuard: Handle = async ({ event, resolve }) => {
  console.log(event.platform?.env)
  const { cookies, locals, url } = event;
  const { session, user } = await locals.safeGetSession();
  locals.session = session;
  locals.user = user;

  if (!locals.session && url.pathname.startsWith("/account"))
    redirect(
      303,
      `/sign-in?next=${url.pathname}`,
      { type: "info", message: `Du måste logga in först.` },
      cookies,
    );

  return resolve(event);
};

export const handle: Handle = sequence(initCloudflareSentryHandle({
  dsn: "https://485a49edf664c4bad08c2ab0bf87a8eb@o4507622077169664.ingest.de.sentry.io/4507622079660112",
  tracesSampleRate: 1.0,
  // environment: PUBLIC_ENVIRONMENT,
  // enabled: PUBLIC_ENVIRONMENT !== "local",
}), sentryHandle(), supabase, authGuard);