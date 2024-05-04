import { error, fail, redirect } from "@sveltejs/kit";
import { deleteListing } from "src/lib/server/database/listings";

export const load = async ({ locals: { supabase }, params: { slug } }) => {
  const { data: listing } = await supabase
    .from("listings")
    .select()
    .eq("id", slug)
    .limit(1)
    .single();
  if (!listing) {
    console.log("Missing listing for listing id: " + slug);
    error(404, "Listing not found");
  }
  return { listing };
};


export const actions = {
  deleteListing: async ({ locals: { supabase, getSession }, request, params: { slug } }) => {
    const session = await getSession();
    if (!session)
      throw redirect(303, "/login");

    try {
      await deleteListing(supabase, slug);
    } catch (error) {
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
      });
    }
    throw redirect(303, `/account`);
  },
};
