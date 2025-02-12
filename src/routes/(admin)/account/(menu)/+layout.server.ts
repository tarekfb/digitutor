import type { LayoutServerLoad } from "./$types.ts";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event) => {
  const {
    locals: { safeGetSession },
  } = event;

  const { session } = await safeGetSession();
  if (!session) {
    redirect(303, "/sign-in");
  }

  const { profile } = await event.parent();
  return { profile };
};
