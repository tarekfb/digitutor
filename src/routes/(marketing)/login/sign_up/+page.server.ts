import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { genericErrorMessage, unknownErrorHeading, unknownErrorMessage } from "src/lib/constants";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { signUpSchema, type CreateProfile } from "src/lib/models/user";
import { createProfile } from "src/lib/server/database/profiles";
import type { Message } from "src/lib/models/common";

export const ssr = false;


export const load: PageServerLoad = async ({ locals: { getSession } }) => {
    try {
        const session = await getSession();
        if (session)
            throw redirect(303, "/account");

        const form = await superValidate(zod(signUpSchema))
        return { form };
    } catch (e) {
        console.error("Error when loading signup", e);
        throw error(500, {
            message: unknownErrorMessage,
        });
    };
}

export const actions = {
    default: async (event) => {
        const { locals: { supabase, getSession } } = event;
        const session = await getSession();
        if (session)
            throw redirect(303, "/account");

        const form = await superValidate(event, zod(signUpSchema));
        const { email, password, role, first_name, last_name } = form.data;
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        let inputUser: CreateProfile;
        try {
            const { data, error } = await supabase.auth.signUp({
                email, password
            })

            if (error?.status === 429) {
                console.error("Email rate limit exceeded", error)
                return message(form, { variant: "destructive", title: "För många e-postutskick", description: "Kan ej skicka e-post just nu. Försök igen senare." }, { status: 429 });
            }

            if (error) {
                console.error("Supabase error on signup", { error });
                return message(form, {
                    variant: "destructive",
                    title: unknownErrorHeading,
                    description: unknownErrorMessage
                }, { status: 500 });
            }

            if (!data.user) {
                console.error("User data was null on signup", error);
                return message(form, {
                    variant: "destructive",
                    title: unknownErrorHeading,
                    description: unknownErrorMessage
                }, { status: 500 });
            }

            // https://github.com/orgs/supabase/discussions/1282
            if (data.user.identities && data.user.identities.length === 0) {
                return message(form, { variant: "destructive", title: "E-postadressen används redan", description: "Testa att skapa ett konto med annan e-postadress." }, { status: 400 });
            }

            inputUser = {
                id: data.user.id,
                role,
                firstName: first_name,
                lastName: last_name,
            }
        } catch (error) {
            console.error("Error when creating supabase auth user", error);
            return message(form, genericErrorMessage, { status: 500 });
        }

        try {
            await createProfile(supabase, inputUser)
            return message(form, { variant: "success", title: "Verifiera e-postadress", description: "Kika in din inkorg för att verifiera e-posten.", status: 201 });
        } catch (error) {
            console.error("Error when creating profile", error);
            return message(form, genericErrorMessage, { status: 500 });
        }
    }
}