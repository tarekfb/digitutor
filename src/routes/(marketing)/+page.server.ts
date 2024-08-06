import { search } from "src/lib/server/database/search";
import { getGenericFormMessage } from "src/lib/shared/constants/constants";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { searchSchema, type SearchResult, } from "src/lib/shared/models/search";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(searchSchema))

    return { form };
}

export const actions: Actions = {
    search: async (event) => {
        const { locals: { supabase } } = event;

        const form = await superValidate(event, zod(searchSchema));
        if (!form.valid) return fail(400, { form });

        const { query } = form.data;

        try {
            const listings = await search(supabase, query);
            const formatted: SearchResult[] = listings.map(listing => {
                return {
                    id: listing.id,
                    title: listing.title,
                    description: listing.description ?? undefined,
                    hourlyPrice: listing.hourly_price,
                    firstName: listing.profile.first_name,
                    lastName: listing.profile.last_name,
                    avatar: listing.profile.avatar_url ?? undefined
                }
            });

            if (formatted.length === 0)
                return message(form, getGenericFormMessage("default", "Inga träffar på din sökning", "Testa söka på en lärares namn, eller en annons titel, beskrivning eller pris."), { status: 404 });

            return { form, formatted }
        } catch (error) {
            console.error("Error searching for teachers with following search: " + query, error);
            return message(form, getGenericFormMessage(), { status: 500 });
        }
    }
}