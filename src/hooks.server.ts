import { createServerClient } from "@supabase/ssr";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_ENVIRONMENT
} from "$env/static/public";
import { createClient } from "@supabase/supabase-js";
import { PRIVATE_SUPABASE_SERVICE_ROLE } from "$env/static/private";
import { init } from '@jill64/sentry-sveltekit-cloudflare/server'
// import * as Sentry from "@sentry/sveltekit";

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
  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;

  if (!event.locals.session && event.url.pathname.startsWith("/account"))
    return redirect(303, "/sign-up");

  return resolve(event);
};


const { onHandle, onError } = init(
  'https://485a49edf664c4bad08c2ab0bf87a8eb@o4507622077169664.ingest.de.sentry.io/4507622079660112'
   ,
  {
    environment: PUBLIC_ENVIRONMENT
  //   toucanOptions: {
  //     // ... Other Sentry Config
  //   },
  //   handleOptions: {
  //     handleUnknownRoutes: boolean (default: false)
  //   },
  //   enableInDevMode: boolean (default: false)
 }
)

export const handle: Handle = sequence(supabase, authGuard);

// This func is not used but comes from https://github.com/jill64/sentry-sveltekit-cloudflare
// export const handle = onHandle(({ event, resolve }) => {
//   // Your Handle Code
// })

export const handleError = onError((e, sentryEventId) => {
  console.error(e, sentryEventId)
})
