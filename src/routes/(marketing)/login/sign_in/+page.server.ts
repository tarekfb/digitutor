import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { unknownErrorMessage } from "src/lib/constants";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { signInSchema } from "src/lib/models/user";
import { isAuthApiError, type AuthApiError } from "@supabase/supabase-js";

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
            if (error && error.message === "Email not confirmed")
                return message(form, { variant: "warning", title: "Verifiera e-post", description: "E-postadressen är inte verifierad. Kika in din inkorg för att verifiera e-posten." }, { status: 400 });


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
            if (isAuthApiError(error)) {
                const authApiError = error as AuthApiError;
                if (authApiError.message === "Email not confirmed") {
                    console.log("hej frå¨n catch")
                    return fail(500, {
                        message: unknownErrorMessage, form,
                    });
                }

                console.error("Error on signin supabase auth user", error);
                return fail(500, {
                    message: unknownErrorMessage, form,
                });
            }

        }
    }
}