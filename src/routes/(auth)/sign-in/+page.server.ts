import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.ts";
import {
  MessageId,
  getFailFormMessageObjectified,
} from "$lib/shared/constants/constants.ts";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { resendSchema, signInSchema } from "$lib/shared/models/user.ts";
import { getTopTeacher } from "src/lib/server/database/review.ts";
import { formatTopTeacher } from "src/lib/shared/utils/reviews/utils.ts";
import type { TopTeacher } from "src/lib/shared/models/review.ts";
import { logError } from "src/lib/shared/utils/logging/utils.ts";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {

  let displayTeacher: TopTeacher | undefined;
  try {
    const dbTeacher = await getTopTeacher(supabase, 1);
    displayTeacher = dbTeacher.length > 0 ? formatTopTeacher(dbTeacher[0]) : undefined;
  } catch (e) {
    const trackingId = logError({
      error: e,
      message: "Error when fetching signin topteacher",
    });
    displayTeacher = undefined;
  }

  const form = await superValidate(zod(signInSchema));
  const resendEmailForm = await superValidate(zod(resendSchema));

  return { displayTeacher, form, resendEmailForm };
};

export const actions: Actions = {
  signIn: async (event) => {
    const {
      locals: { supabase, session },
      url,
    } = event;

    if (session) redirect(303, "/account");

    const form = await superValidate(event, zod(signInSchema));

    if (!form.valid) return fail(400, { form });
    const { password } = form.data;
    const email = form.data.email.trim();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        switch (error.message) {
          case "Invalid login credentials":
            return message(
              form,
              {
                variant: "destructive",
                title: "Ogiltiga inloggingsuppgifter",
                description: "E-postadressen eller lösenordet stämmer inte.",
              },
              { status: 401 },
            );
          case "Email not confirmed": {

            // try to resend confirmation email
            // can return error but not relevant, just act as if no resend was attempted
            const { error: resendError } = await supabase.auth.resend({
              type: "signup",
              email,
              options: {
                emailRedirectTo: "/account",
              },
            }); // todo: test this flow
            if (resendError?.status === 429) {
              return message(
                form,
                {
                  variant: "warning",
                  title: "Verifiera e-postadress",
                  description:
                    "E-postadressen är inte verifierad. Titta i din inkorg (eller i skräpkorgen) för att verifiera e-posten.",
                  id: MessageId.RateLimitExceeded,
                },
                { status: 403 },
              );
            }
            return message(
              form,
              {
                variant: "warning",
                title: "Verifiera e-postadress",
                description:
                  "E-postadressen är inte verifierad. Ett bekräftelsemail har skickats. Titta i din inkorg (eller i skräpkorgen) för att verifiera e-posten.",
              },
              { status: 403 },
            );
          }
          default:
            {
              const trackingId = logError({
                error,
                message: "Supabase error on signin",
              });
              return message(form, getFailFormMessageObjectified({ trackingId }), { status: 500 });
            }
        }
      }
      if (!data.user) {
        const trackingId = logError({
          message: "User data was null on signin",
        });
        return message(form, getFailFormMessageObjectified({ trackingId }), { status: 500 });
      }
    } catch (error) {
      const trackingId = logError({
        error,
        message: "Error on signin supabase auth user",
      });
      return message(form, getFailFormMessageObjectified({ trackingId }), { status: 500 });
    }

    redirect(302, url.searchParams.get("next") ?? "/account");
  },
};
