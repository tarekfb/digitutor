import { requestPasswordResetSchema } from 'src/lib/shared/models/user.ts';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types.ts';
import { redirect } from 'sveltekit-flash-message/server';
import { getFailFormMessage, getSuccessFormMessage } from 'src/lib/shared/constants/constants.ts';

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
            const { error } = await supabase.auth.resetPasswordForEmail(email)
            if (error) {
                console.error("Error when requesting password reset", error);
                return message(form, getFailFormMessage(), { status: 500 });
            }
        } catch (error) {
            console.error("Error when requesting password reset", error);
            return message(form, getFailFormMessage(), { status: 500 });
        }

        return message(form, getSuccessFormMessage("Titta i din inkorg", "Om du har ett konto hos oss har ett e-postmeddelande med instruktioner för att återställa lösenordet skickats. Kontrollera även skräpkorgen om du inte hittar det i inkorgen."));
    }
}
