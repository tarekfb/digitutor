import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { unknownErrorMessage } from "src/lib/constants";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { signInSchema, type CreateProfileInput } from "src/lib/models/user";
import { createProfile } from "src/lib/server/database/profiles";

export const ssr = false;


export const load: PageServerLoad = async ({ locals: { getSession } }) => {
    try {
        const session = await getSession();
        if (session)
            throw redirect(303, "/account");

        const form = await superValidate(zod(signInSchema))
        return { form };
    } catch (e) {
        console.error("Error when loading signin", e);
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

        const form = await superValidate(event, zod(signInSchema));
        const { email, password } = form.data;
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email, password
            })

            if (error) {
                console.error("Supabase error on signin", { error });
                return fail(500, { message: unknownErrorMessage, form })
            }

            if (!data.user) {
                console.error("User data was null on signup", error);
                return fail(500, { message: unknownErrorMessage, form })
            }

            return message(form, 'Inloggning lyckades');

        } catch (error) {
            console.error("Error on signin supabase auth user", error);
            return fail(500, {
                message: unknownErrorMessage, form,
            });
        }

    }
}
