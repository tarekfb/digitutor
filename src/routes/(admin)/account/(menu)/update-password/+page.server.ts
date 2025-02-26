import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types.ts";
import { fail, message, superValidate } from "sveltekit-superforms";
import { passwordResetSchema } from "src/lib/shared/models/user.ts";
import {
  getFailFormMessage,
  getFailFormMessageObjectified,
  getSuccessFormMessage,
} from "src/lib/shared/constants/constants.ts";
import { SupabaseErrorMessages } from "src/lib/shared/models/common.ts";
import { logErrorServer } from "src/lib/shared/utils/logging/utils.ts";

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
        return message(
          form,
          getFailFormMessage(
            "Ange ett helt nytt lösenord",
            "Ange ett lösenord som aldrig har använts tidigare.",
          ),
          { status: 500 },
        );

      const trackingId = logErrorServer({ error, message: "Unknown error updating user password" });
      return message(
        form,
        getFailFormMessageObjectified({
          title: "Kunde inte uppdatera lösenordet",
          description: "Något gick fel. Du kan kontakta oss om detta fortsätter.",
          trackingId
        }),
        { status: 500 },
      );
    }

    return message(
      form,
      getSuccessFormMessage(
        "Lösenordet har uppdaterats",
        "Använd detta lösenord i framtiden för att logga in.",
      ),
    );
  },
};
