import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getFailFormMessage, unknownErrorTitle } from "$lib/shared/constants/constants";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { signUpSchema } from "$lib/shared/models/user";
import { createProfile } from "$lib/server/database/profiles";
import type { CreateProfile } from "$lib/shared/models/profile";
import { getHighQualityReviews } from "src/lib/server/database/review";
import type { PsqlError } from "src/lib/shared/models/common";


export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    let review;
    try {
        const reviews = await getHighQualityReviews(supabase, 1);
        const longReviews = reviews.filter(r => r.description && r.description.length > 15);
        review = longReviews[0] ?? reviews[0];
    } catch (e) {
        console.error("Error when reviews signup display, perhaps didnt find valid review", e);
        error(500, {
            message: unknownErrorTitle,
        });
    };
    const form = await superValidate(zod(signUpSchema))
    return { form, review };
}

export const actions = {
    default: async (event) => {
        const { locals: { supabase, session } } = event;
        if (session)
            redirect(303, "/account");

        const form = await superValidate(event, zod(signUpSchema));
        if (!form.valid) return fail(400, { form });

        const { email, password, role, first_name, last_name } = form.data;
        let inputUser: CreateProfile;
        try {
            const { data, error } = await supabase.auth.signUp({
                email, password
            })

            // this error takes presence of email in use and presumably more errors
            if (error?.status === 429) {
                console.error("Email rate limit exceeded", error)
                return message(form, { variant: "destructive", title: "För många e-postutskick", description: "Kan ej skicka e-post just nu. Försök igen senare." }, { status: 429 });
            }

            if (!data.user) {
                console.error("User data was null on signup", error);
                return message(form, getFailFormMessage(), { status: 500 });
            }

            // https://github.com/orgs/supabase/discussions/1282
            if (data.user.identities && data.user.identities.length === 0)
                return setError(form, "email", "E-postadressen används redan");

            if (error) {
                console.error("Supabase error on signup", { error });
                return message(form, getFailFormMessage(), { status: 500 });
            }

            inputUser = {
                id: data.user.id,
                role,
                firstName: first_name,
                lastName: last_name,
            }
        } catch (error) {
            console.error("Error when creating supabase auth user", error);
            return message(form, getFailFormMessage(), { status: 500 });
        }

        try {
            await createProfile(supabase, inputUser)
            return message(form, { variant: "success", title: "Verifiera e-postadress", description: "Kika i din inkorg för att verifiera e-post: " + email + ".", status: 201 });
        } catch (error) {
            if (error && typeof error === "object") {
                const psqlError = error as PsqlError;
                if (psqlError.code && psqlError.code === "23505") // duplicate key constraint violation - somehow profile exists but not user. Allow.
                    return message(form, { variant: "success", title: "Verifiera e-postadress", description: "Kika i din inkorg för att verifiera e-post: " + email + ".", status: 201 });
            }

            console.error("Error when creating profile", error);
            return message(form, getFailFormMessage(), { status: 500 });
        }
    }
}