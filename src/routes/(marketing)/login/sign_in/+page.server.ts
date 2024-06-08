import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { MessageId, getGenericErrorMessage, unknownErrorMessage } from "src/lib/constants";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { resendSchema, signInSchema } from "src/lib/models/user";

export const ssr = false;

export const load: PageServerLoad = async ({ locals: { session } }) => {
    try {
        if (session)
            throw redirect(303, "/account");

        const form = await superValidate(zod(signInSchema))
        const resendEmailForm = await superValidate(zod(resendSchema))

        return { form, resendEmailForm };
    } catch (e) {
        console.error("Error when loading signin", e);
        throw error(500, {
            message: unknownErrorMessage,
        });
    };
}

export const actions: Actions = {
    signIn: async (event) => {
        const { locals: { supabase, session } } = event;
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
                        return message(form, { variant: "warning", title: "Verifiera e-postadress", description: "E-postadressen är inte verifierad. Ett bekräftelsemail har skickats.Kika i din inkorg för att verifiera e-posten." }, { status: 403 });

                    default:
                        console.error("Supabase error on signin", { error });
                        return message(form, getGenericErrorMessage(), { status: 500 });
                }
            }
            if (!data.user) {
                console.error("User data was null on signup", error);
                return message(form, getGenericErrorMessage(), { status: 500 });
            }
        } catch (error) {
            console.error("Error on signin supabase auth user", error);
            return message(form, getGenericErrorMessage(), { status: 500 });
        }
        throw redirect(302, "/"); // todo: redirect to /account
    },

}