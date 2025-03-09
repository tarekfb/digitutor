// This is just a very simple API route that throws an example error.
// Feel free to delete this file and the entire sentry route.

import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async (event) => {
  const {
    url,
    locals: { supabase },
  } = event;
  throw new Error("test");
}