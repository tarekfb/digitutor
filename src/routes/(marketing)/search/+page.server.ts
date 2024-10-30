import { search } from "src/lib/server/database/search";
import {
    getFailFormMessage
} from "src/lib/shared/constants/constants";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { searchSchema, type SearchResult, } from "src/lib/shared/models/search";
import type { Actions, PageServerLoad } from "./$types";
import type { Message, PsqlError } from "src/lib/shared/models/common";
import { formatProfile } from "src/lib/utils";

export const load = (async ({ url, locals: { supabase } }) => {
    const query = url.searchParams.get('q') || '';
    const form = await superValidate(zod(searchSchema))

    let initMessage: Message | undefined;
    let initResults: SearchResult[] = [];

    if (!query) return { form, initResults, initMessage }

    try {
        const listings = await search(supabase, query);
        initResults = listings.map(listing => ({
            id: listing.id,
            title: listing.title,
            description: listing.description ?? undefined,
            hourlyPrice: listing.hourly_price,
            firstName: listing.profile.first_name,
            lastName: listing.profile.last_name,
            avatar: listing.profile.avatar_url ?? undefined,
            subjects: listing.subjects,
            profile: formatProfile(listing.profile),
        }));

    } catch (error) {
        if (error && typeof error === "object") {
            const psqlError = error as PsqlError;
            if (psqlError.code == "42601") // syntax error
                initMessage = getFailFormMessage("Ogiltiga karaktärer", "Testa söka på något annat.");
            else
                initMessage = getFailFormMessage("Något gick fel", "Testa söka på något annat, eller försök igen senare.");

        } else {
            console.error("Error searching for teachers with following search: " + query, error);
            initMessage = getFailFormMessage();
        }
    }

    return { form, initResults, initMessage }
}) satisfies PageServerLoad;


export const actions: Actions = {
    search: async (event) => {
        const { locals: { supabase } } = event;

        const form = await superValidate(event, zod(searchSchema));
        if (!form.valid) return fail(400, { form });
        const { query } = form.data;

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
                    avatar: listing.profile.avatar_url ?? undefined,
                    subjects: listing.subjects,
                    profile: formatProfile(listing.profile),
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