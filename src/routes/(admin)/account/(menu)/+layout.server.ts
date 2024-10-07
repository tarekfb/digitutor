import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event) => {
  const { locals: { safeGetSession }, depends } = event;
  depends("conversations:has_replied");

  const { session } = await safeGetSession();
  if (!session) {
    redirect(303, "/sign-in");
  }

  const { profile } = await event.parent();

  return { profile };
};
