import { requestPasswordResetSchema } from 'src/lib/shared/models/user';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { getFailFormMessage, prodBaseUrl } from 'src/lib/shared/constants/constants';

export const load = (async () => {
    const form = await superValidate(zod(requestPasswordResetSchema));
    return { form };
}) satisfies PageServerLoad;

export const actions = {
    requestReset: async (event) => {
        const {
            locals: { supabase, session },
        } = event;

        if (session) redirect(303, "/account");

        const form = await superValidate(event, zod(requestPasswordResetSchema));

        const { email } = form.data;
        if (!form.valid) return fail(400, { form });

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${prodBaseUrl}/account/update-password`,
            })
            if (error) {
                console.error("Error when requesting password reset", error);
                return message(form, getFailFormMessage("Kunde inte skicka e-post med information för att återställa lösenord"), { status: 500 });
            }
        } catch (error) {
            console.error("Error when requesting password reset", error);
            return message(form, getFailFormMessage("Kunde inte skicka e-post med information för att återställa lösenord"), { status: 500 });
        }

        setFlash({ message: "Kika i din inkorg (eller i skräpkorgen) för information om hur du återställer ditt lösenord.", type: "success" }, event);
        return { form };
    }
}