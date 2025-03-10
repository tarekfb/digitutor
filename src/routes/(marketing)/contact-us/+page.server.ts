import { fail } from "@sveltejs/kit";
import { getNow } from "src/lib/shared/utils/utils.js";
import type { Actions, PageServerLoad } from "./$types.ts";
import { contactUsSchema } from "$lib/shared/models/contact-us.ts";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { getFailFormMessage } from "$lib/shared/constants/constants.ts";
import { logErrorServer } from "src/lib/shared/utils/logging/utils.ts";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(contactUsSchema));
  return { form };
};

export const actions: Actions = {
  submit: async (event) => {
    const {
      locals: { supabaseServiceRole },
    } = event;

    const form = await superValidate(event, zod(contactUsSchema));
    if (!form.valid) return fail(400, { form });

    const { firstName, lastName, email, message: contactMessage } = form.data;
    try {
      const { error: insertError } = await supabaseServiceRole
        .from("contact_requests")
        .insert({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          message_body: contactMessage,
          updated_at: getNow(),
        });

      if (insertError) {
        const trackingId = logErrorServer({ error: insertError, message: "Error when inserting contact request" });
        return message(
          form,
          getFailFormMessage({
            trackingId,
            description: "Kunde ej skicka meddelandet. Försök igen lite senare.",
          }),
          { status: 500 },
        );
      }

      return { form };
    } catch (error) {
      const trackingId = logErrorServer({ error, message: "Unknown error when inserting contact request" });
      return message(
        form,
        getFailFormMessage({
          trackingId,
          description: "Kunde ej skicka meddelandet. Försök igen lite senare.",
        }),
        { status: 500 },
      );
    }
  },
};
