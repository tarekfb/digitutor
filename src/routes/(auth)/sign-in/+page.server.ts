import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.ts";
import {
  MessageId,
  getFailFormMessage,
} from "$lib/shared/constants/constants.ts";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { resendSchema, signInSchema } from "$lib/shared/models/user.ts";
import { getHighQualityReviews } from "src/lib/server/database/review.ts";
import { getListingsByTeacher } from "src/lib/server/database/listings.ts";
import { formatReviewWithReferences } from "src/lib/shared/utils/reviews/utils.ts";
import type { ReviewWithReferences } from "src/lib/shared/models/review.ts";
import type { ListingWithProfile } from "src/lib/shared/models/listing.ts";
import { formatListingWithProfile } from "src/lib/shared/utils/listing/utils.ts";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  let longReviews: ReviewWithReferences[];
  try {
    const dbReviews = await getHighQualityReviews(supabase);
    let sorted = dbReviews.sort(
      (a, b) => (b.description?.length ?? 0) - (a.description?.length ?? 0),
    );
    sorted = sorted.slice(0, 3);
    longReviews = sorted.map((s) => formatReviewWithReferences(s));
  } catch (e) {
    console.error(
      "Error when fetching signin display review, perhaps didnt find valid review",
      e,
    );
    longReviews = [];
  }

  let subjects: number[] = [];
  let listings: ListingWithProfile[] = [];
  if (longReviews[0]) {
    try {
      const dbListings = await getListingsByTeacher(
        supabase,
        longReviews[0].receiver.id,
      );
      listings = dbListings.map((listing) => formatListingWithProfile(listing));
      subjects = listings.flatMap((listing) => listing.subjects);
    } catch (e) {
      console.error("Error when fetching listings and subjects for signin", e);
      subjects = [];
      listings = [];
    }
  }

  const form = await superValidate(zod(signInSchema));
  const resendEmailForm = await superValidate(zod(resendSchema));

  return { listings, subjects, reviews: longReviews, form, resendEmailForm };
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
            console.error("Supabase error on signin", { error });
            return message(form, getFailFormMessage(), { status: 500 });
        }
      }
      if (!data.user) {
        console.error("User data was null on signup", error);
        return message(form, getFailFormMessage(), { status: 500 });
      }
    } catch (error) {
      console.error("Error on signin supabase auth user", error);
      return message(form, getFailFormMessage(), { status: 500 });
    }

    redirect(302, url.searchParams.get("next") ?? "/account");
  },
};
