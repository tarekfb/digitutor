import { search } from "src/lib/server/database/search";
import { getFailFormMessage, getInfoFormMessage } from "src/lib/shared/constants/constants";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { searchSchema, type SearchResult, } from "src/lib/shared/models/search";
import type { Actions, PageServerLoad } from "./$types";
import type { PsqlError } from "src/lib/shared/models/common";

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

        // return { form, formatted: [] }
        const cleanedQuery = query.trim();

        try {
            const listings = await search(supabase, cleanedQuery);
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

            return { form, formatted }
        } catch (error) {
            if (error && typeof error === "object") {
                const psqlError = error as PsqlError;
                if (psqlError.code && psqlError.code === "42601") // syntax error
                    return message(form, getFailFormMessage("Ogiltiga karaktärer", "Testa söka på något annat."), { status: 400 });
            }
            console.error("Error searching for teachers with following search: " + query, error);
            return message(form, getFailFormMessage(), { status: 500 });
        }
    }
}