import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { genericErrorMessage, unknownErrorMessage } from "src/lib/constants";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { signInSchema } from "src/lib/models/user";

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
                switch (error.message) {
                    case "Invalid login credentials":
                        return message(form, { variant: "destructive", title: "Ogiltiga inloggingsuppgifter", description: "E-postadressen eller lösenordet stämmer inte överens." }, { status: 400 });
                    case "Email not confirmed":
                        return message(form, { variant: "warning", title: "Verifiera e-post", description: "E-postadressen är inte verifierad. Kika i din inkorg för att verifiera e-posten." }, { status: 400 });
                    default:
                        console.error("Supabase error on signin", { error });
                        return message(form, genericErrorMessage, { status: 500 });
                }
            }
            if (!data.user) {
                console.error("User data was null on signup", error);
                return message(form, genericErrorMessage, { status: 500 });
            }
        } catch (error) {
            console.error("Error on signin supabase auth user", error);
            return message(form, genericErrorMessage, { status: 500 });
        }
        throw redirect(302, "/account");
    }
}