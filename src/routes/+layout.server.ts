import type { LayoutServerLoad } from "./$types.ts";
import { loadFlash } from "sveltekit-flash-message/server";

export const load: LayoutServerLoad = loadFlash(async (event) => {
  const {
    locals: { session },
  } = event;
  return {
    session,
  };
});
