import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { MessageId, getFailFormMessage, unknownErrorMessage } from "$lib/shared/constants/constants";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { resendSchema, signInSchema } from "$lib/shared/models/user";
import { getDisplayReviews } from "src/lib/server/database/review";
import { getListingsByTeacher } from "src/lib/server/database/listings";
import { Subjects } from "src/lib/shared/models/common";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    let longReviews;
    try {
        const reviews = await getDisplayReviews(supabase);
        const sorted = reviews.sort((a, b) => (b.description?.length ?? 0) - (a.description?.length ?? 0));
        longReviews = sorted.slice(0, 3);
    }
    catch (e) {
        console.error("Error when fetching signin display review, perhaps didnt find valid review", e);
        throw error(500, {
            message: unknownErrorMessage,
        });
    }


    let listings;
    let subjects: Subjects[] = [];
    try {
        listings = await getListingsByTeacher(supabase, longReviews[0].receiver.id);
        subjects = listings.flatMap(listing => listing.subjects)
    }
    catch (e) {
        console.error("Error when fetching listings and subjects for signin", e);
    }

    const form = await superValidate(zod(signInSchema))
    const resendEmailForm = await superValidate(zod(resendSchema))
    return { listings, subjects, reviews: longReviews, form, resendEmailForm };
};

export const actions: Actions = {
    signIn: async (event) => {
        const { locals: { supabase, session } } = event;

        if (session)
            throw redirect(303, "/account");

        const form = await superValidate(event, zod(signInSchema));

        const { email, password } = form.data;
        if (!form.valid) return fail(400, { form });

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email, password
            })
            if (error) {
                switch (error.message) {
                    case "Invalid login credentials":
                        return message(form, { variant: "destructive", title: "Ogiltiga inloggingsuppgifter", description: "E-postadressen eller lösenordet stämmer inte." }, { status: 401 });
                    case "Email not confirmed":
                        // try to resend confirmation email
                        // can return error but not relevant, just act as if no resend was attempted
                        const { error: resendError } = await supabase.auth.resend({
                            type: 'signup',
                            email,
                            options: {
                                emailRedirectTo: '/account'
                            }
                        })
                        if (resendError?.status === 429) {
                            return message(form, { variant: "warning", title: "Verifiera e-postadress", description: "E-postadressen är inte verifierad. Kika i din inkorg för att verifiera e-posten.", id: MessageId.RateLimitExceeded }, { status: 403 });
                        }
                        return message(form, { variant: "warning", title: "Verifiera e-postadress", description: "E-postadressen är inte verifierad. Ett bekräftelsemail har skickats. Kika i din inkorg för att verifiera e-posten." }, { status: 403 });

                    default:
                        console.error("Supabase error on signin", { error });
                        return message(form, getFailFormMessage(), { status: 500 });
                }
            }
            if (!data.user) {
                console.error("User data was null on signup", error);
                return message(form, getFailFormMessage(), { status: 500 });
            }
        } catch (error) {
            console.error("Error on signin supabase auth user", error);
            return message(form, getFailFormMessage(), { status: 500 });
        }
        throw redirect(302, "/account");
    },

}