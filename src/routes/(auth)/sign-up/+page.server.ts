import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getGenericFormMessage, unknownErrorMessage } from "$lib/shared/constants/constants";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { signUpSchema } from "$lib/shared/models/user";
import { createProfile } from "$lib/server/database/profiles";
import type { CreateProfile } from "$lib/shared/models/profile";
import type { Tables } from "src/supabase";
import { getNow } from "src/lib/utils";
import { getDisplayReview } from "src/lib/server/database/review";


export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    try {
        const form = await superValidate(zod(signUpSchema))

        const profile: Tables<"profiles"> = {
            id: "0",
            avatar_url: "",
            updated_at: getNow(),
            created_at: getNow(),
            first_name: "Bob",
            last_name: "Builder",
            role: "student"
        }
        const reviews = await getDisplayReview(supabase, 1);
        const review = reviews[0] ?? undefined;
        return { form, review, profile };
    } catch (e) {
        console.error("Error when loading signup", e);
        throw error(500, {
            message: unknownErrorMessage,
        });
    };
}

export const actions = {
    default: async (event) => {
        const { locals: { supabase, session } } = event;
        if (session)
            throw redirect(303, "/account");

        const form = await superValidate(event, zod(signUpSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

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
                return message(form, getGenericFormMessage(), { status: 500 });
            }

            // https://github.com/orgs/supabase/discussions/1282
            if (data.user.identities && data.user.identities.length === 0)
                return setError(form, "email", "E-postadressen används redan");

            if (error) {
                console.error("Supabase error on signup", { error });
                return message(form, getGenericFormMessage(), { status: 500 });
            }

            inputUser = {
                id: data.user.id,
                role,
                firstName: first_name,
                lastName: last_name,
            }
        } catch (error) {
            console.error("Error when creating supabase auth user", error);
            return message(form, getGenericFormMessage(), { status: 500 });
        }

        try {
            await createProfile(supabase, inputUser)
            return message(form, { variant: "success", title: "Verifiera e-postadress", description: "Kika i din inkorg för att verifiera e-post: " + email + ".", status: 201 });
        } catch (error) {
            if (error && typeof error === "object") {
                const supabaseError = error as {
                    code: string; message: string;
                }
                if (supabaseError.code && supabaseError.code === "23505") // duplicate key constraint violation - somehow profile exists but not user. Allow.
                    return message(form, { variant: "success", title: "Verifiera e-postadress", description: "Kika i din inkorg för att verifiera e-post: " + email + ".", status: 201 });
            }

            console.error("Error when creating profile", error);
            return message(form, getGenericFormMessage(), { status: 500 });
        }
    }
}