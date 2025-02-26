import { PRIVATE_STRIPE_API_KEY } from "$env/static/private";
import { error } from "@sveltejs/kit";
import Stripe from "stripe";

import {
  getOrCreateCustomerId,
  fetchSubscription,
} from "src/lib/shared/utils/subscription/subscription-helper.ts";
import { getDefaultErrorInfo, websiteName } from "src/lib/shared/constants/constants.ts";
import type { PageServerLoad } from "./$types.ts";
import { redirect } from "sveltekit-flash-message/server";
import { logErrorServer } from "src/lib/shared/utils/logging/utils.ts";

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY);
// { apiVersion: "2023-08-16" }

export const load: PageServerLoad = async ({
  params: { slug },
  url,
  locals: { safeGetSession, supabaseServiceRole }, parent, cookies
}) => {
  const { session, user } = await safeGetSession();
  if (!session || !user) {
    redirect(303, "/sign-in");
  }

  const successUrl = "/account/billing";

  // free plan. simulate success by redirecting to success url
  if (slug === "free") redirect(303, successUrl);

  const { profile } = await parent();
  if (profile.role === "teacher")
    redirect(
      303,
      "/account",
      {
        type: "info",
        message: `Du är lärare och betalar därför ingenting för att använda ${websiteName}.`,
      },
      cookies,
    );

  const { error: idError, customerId } = await getOrCreateCustomerId({
    supabaseServiceRole,
    user,
  });
  if (idError || !customerId) {
    const trackingId = logErrorServer({
      error: idError,
      message: "Error creating customer id",
    });
    error(500, { ...getDefaultErrorInfo({ trackingId }) });
  }

  const { primarySubscription } = await fetchSubscription({
    customerId,
  });
  if (primarySubscription) {
    // User already has plan, we shouldn't let them buy another
    redirect(
      303,
      successUrl,
      {
        type: "info",
        message: `Du har redan en prenumeration.`,
      },
      cookies,
    );
  }

  const mode =
    url.searchParams.get("mode") === "payment" ? "payment" : "subscription"; // if credits, then single purchase (payment)

  let checkoutUrl;
  let stripeSession: Stripe.Response<Stripe.Checkout.Session> | undefined;
  try {
    stripeSession = await stripe.checkout.sessions.create({
      metadata: {
        user_id: session.user.id,
        price_id: slug,
      },
      line_items: [
        {
          price: slug,
          quantity: 1,
        },
      ],
      customer: customerId,
      mode,
      success_url: `${url.origin}${successUrl}`,
      cancel_url: `${url.origin}${successUrl}`,
    });
    checkoutUrl = stripeSession.url;
  } catch (e) {
    const trackingId = logErrorServer({
      error: e,
      message: "Error creating checkout session",
    });
    error(500, { ...getDefaultErrorInfo({ trackingId }) });
  }

  redirect(303, checkoutUrl ?? "/pricing"); // stripe takes over checkout process
};
