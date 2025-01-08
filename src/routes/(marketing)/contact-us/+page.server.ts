import { fail } from "@sveltejs/kit";
import { getNow } from "src/lib/shared/utils/utils.js";
import type { Actions, PageServerLoad } from "./$types";
import { contactUsSchema } from "$lib/shared/models/contact-us";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { getFailFormMessage } from "$lib/shared/constants/constants";

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
          first_name: firstName,
          last_name: lastName,
          email,
          message_body: contactMessage,
          updated_at: getNow(),
        });

      if (insertError) {
        console.error("Error when inserting contact request", insertError);
        return message(
          form,
          getFailFormMessage(
            undefined,
            "Kunde ej skicka meddelandet. Försök igen lite senare.",
          ),
          { status: 500 },
        );
      }

      return { form };
    } catch (error) {
      console.error("Unknown error when inserting contact request", error);
      return message(
        form,
        getFailFormMessage(
          undefined,
          "Kunde ej skicka meddelandet. Försök igen lite senare.",
        ),
        { status: 500 },
      );
    }
  },
};
