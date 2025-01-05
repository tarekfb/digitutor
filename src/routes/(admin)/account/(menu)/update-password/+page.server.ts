import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { passwordResetSchema } from 'src/lib/shared/models/user';
import { getFailFormMessage } from 'src/lib/shared/constants/constants';
import { setFlash } from 'sveltekit-flash-message/server';
import { SupabaseErrorMessages } from 'src/lib/shared/models/common';

export const load = (async () => {
    const form = await superValidate(zod(passwordResetSchema));
    return { form };
}) satisfies PageServerLoad;

export const actions = {
    reset: async (event) => {
        const {
            locals: { supabase },
        } = event;

        const form = await superValidate(event, zod(passwordResetSchema));

        const { newPassword } = form.data;
        if (!form.valid) return fail(400, { form });

        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            if (error.message === SupabaseErrorMessages.NewPasswordNotDifferent)
                return message(form, getFailFormMessage("Ange ett helt nytt lösenord", "Ange ett lösenord som aldrig har använts tidigare."), { status: 500 });
            
            console.error("Unknown error updating user password", error);
            return message(form, getFailFormMessage("Kunde inte uppdatera lösenordet", "Något gick fel. Du kan kontakta oss om detta fortsätter."), { status: 500 });
        }

        setFlash({ message: "Lösenordet har uppdaterats.", type: "success" }, event);
        return { form };
    }
}