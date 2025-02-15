import { fail } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";
import type { PageServerLoad } from "./$types.ts";
import {
  freeCredits,
  getFailFormMessage,
} from "$lib/shared/constants/constants.ts";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { signUpSchema } from "$lib/shared/models/user.ts";
import { createProfile } from "$lib/server/database/profiles.ts";
import type { CreateProfile } from "$lib/shared/models/profile.ts";
import { getHighQualityReviews } from "src/lib/server/database/review.ts";
import { ExternalErrorCodes } from "src/lib/shared/models/common.ts";
import { isErrorWithCode } from "src/lib/shared/utils/utils.ts";
import type { ReviewWithReferences } from "src/lib/shared/models/review.ts";
import { formatReviewWithReferences } from "src/lib/shared/utils/reviews/utils.ts";
import { updateCredits } from "src/lib/server/database/credits.ts";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  let review: ReviewWithReferences | undefined;
  try {
    const reviews = await getHighQualityReviews(supabase, 1);
    const longReviews = reviews.filter(
      (r) => r.description && r.description.length > 15,
    );
    const dbReview = longReviews[0] ?? reviews[0];
    if (dbReview) review = formatReviewWithReferences(dbReview);
  } catch (e) {
    console.error(
      "Error when reviews signup display, perhaps didnt find valid review",
      e,
    );
    review = undefined;
  }
  const form = await superValidate(zod(signUpSchema));
  return { form, review };
};

export const actions = {
  signUp: async (event) => {
    const {
      locals: { supabase, session, supabaseServiceRole },
      cookies,
    } = event;
    if (session)
      redirect(
        303,
        "/account",
        {
          type: "info",
          message: "Du är redan inloggad.",
        },
        cookies,
      );

    const form = await superValidate(event, zod(signUpSchema));
    if (!form.valid) return fail(400, { form });

    const { password, role, } = form.data;
    const firstName = form.data.firstName.trim();
    const lastName = form.data.lastName.trim();
    const email = form.data.email.trim();

    let inputUser: CreateProfile;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      // this error takes presence of email in use and presumably more errors
      if (error?.status === 429) {
        console.error("Email rate limit exceeded", error);
        return message(
          form,
          {
            variant: "destructive",
            title: "För många e-postutskick",
            description: "Kan ej skicka e-post just nu. Försök igen senare.",
          },
          { status: 429 },
        );
      }

      if (!data.user) {
        console.error("User data was null on signup", error);
        return message(form, getFailFormMessage(), { status: 500 });
      }

      // https://github.com/orgs/supabase/discussions/1282
      if (data.user.identities && data.user.identities.length === 0)
        return setError(form, "email", "E-postadressen används redan");

      if (error) {
        console.error("Supabase error on signup", { error });
        return message(form, getFailFormMessage(), { status: 500 });
      }

      inputUser = {
        id: data.user.id,
        role,
        firstName,
        lastName,
      };
    } catch (error) {
      console.error("Error when creating supabase auth user", error);
      return message(form, getFailFormMessage(), { status: 500 });
    }

    try {
      await createProfile(supabase, inputUser);
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (error.code === ExternalErrorCodes.DuplicateKeyConstraintViolation)
          // somehow profile exists but not user. Allow.
          return message(form, {
            variant: "success",
            title: "Verifiera e-postadress",
            description:
              "Titta i din inkorg (eller i skräpkorgen) för att verifiera e-post: " +
              email +
              ".",
            status: 201,
          });
      }

      console.error("Error when creating profile", error);
      return message(form, getFailFormMessage(), { status: 500 });
    }

    try {
      await updateCredits(supabaseServiceRole, freeCredits, inputUser.id);
    } catch (error) {
      console.error(
        `Unknown error when adding free credits to new profile with id ${inputUser.id}`,
        error,
      );
    }

    return message(form, {
      variant: "success",
      title: "Verifiera e-postadress",
      description: `Titta i din inkorg (eller i skräpkorgen) för att verifiera e-post: ${email}.`,
      status: 201,
    });
  },
};
