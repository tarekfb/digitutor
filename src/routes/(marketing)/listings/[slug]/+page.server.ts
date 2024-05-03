import { error } from "@sveltejs/kit";

export const load = async ({ locals: { supabase }, params: { slug } }) => {
    const { data: listing } = await supabase.from("listings").select().eq("id", slug).limit(1).single();
    if (!listing) {
        console.log("Missing listing for listing id: " + slug);
        error(404, "Listing not found");
    }
    return { listing };
};
