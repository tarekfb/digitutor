import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.ts";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { getFailFormMessage } from "$lib/shared/constants/constants.ts";
import { reportBugSchema } from "src/lib/shared/models/report-bug.ts";

export const load: PageServerLoad = async ({ url }) => {
  const trackingId = url.searchParams.get("id") ?? "";
  const form = await superValidate({ trackingId }, zod(reportBugSchema));
  return { form };
};

export const actions: Actions = {
  submit: async (event) => {
    const {
      locals: { supabase },
    } = event;

    const form = await superValidate(event, zod(reportBugSchema));
    if (!form.valid) return fail(400, { form });

    const { trackingId, description } = form.data;

    try {
      const { error: insertError } = await supabase
        .from("bug_report")
        .insert({
          tracking_id: trackingId?.trim(),
          description: description?.trim(),
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
