import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.ts";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { getFailFormMessageObjectified } from "$lib/shared/constants/constants.ts";
import { reportBugSchema } from "src/lib/shared/models/report-bug.ts";
import { logErrorServer } from "src/lib/shared/utils/logging/utils.ts";

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
      const { error } = await supabase
        .from("bug_report")
        .insert({
          tracking_id: trackingId?.trim(),
          description: description?.trim(),
        });

      if (error) {
        const trackingId = logErrorServer({ error, message: "Error when inserting bug report" });
        return message(
          form,
          getFailFormMessageObjectified(
            {
              trackingId,
              description: "Kunde ej skicka meddelandet. Försök igen lite senare.",
            }
          ),
          { status: 500 },
        );
      }

      return { form };
    } catch (error) {
      const trackingId = logErrorServer({ error, message: "Unknown error when inserting contact request" });
      return message(
        form,
        getFailFormMessageObjectified({
          trackingId,
          description: "Kunde ej skicka meddelandet. Försök igen lite senare.",
        }),
        { status: 500 },
      );
    }
  },
};
