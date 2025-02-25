import { PRIVATE_STRIPE_API_KEY } from "$env/static/private";
import { error } from "@sveltejs/kit";
import Stripe from "stripe";
import type { PageServerLoad } from "./$types.ts";
import { getDefaultErrorInfoObjectified } from "src/lib/shared/constants/constants.ts";
import { getOrCreateCustomerId } from "src/lib/shared/utils/subscription/subscription-helper.ts";
import { redirect } from "sveltekit-flash-message/server";
import { logError } from "src/lib/shared/utils/logging/utils.ts";

// , { apiVersion: "2023-08-16" }
const stripe = new Stripe(PRIVATE_STRIPE_API_KEY);

export const load = (async ({
  url,
  locals: { safeGetSession, supabaseServiceRole },
  cookies,
}) => {
  const { session } = await safeGetSession();
  if (!session) {
    redirect(303, "/login");
  }

  const { error: idError, customerId } = await getOrCreateCustomerId({
    supabaseServiceRole,
    user: session.user,
  });
  if (idError || !customerId) {
    const trackingId = logError(idError, {
      message: "Error creating customer id in billing manage page",
    });
    error(500, { ...getDefaultErrorInfoObjectified({ trackingId }) });
  }

  let portalLink;
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${url.origin}/account/billing`,
    });
    portalLink = portalSession?.url;
  } catch (e) {
    const trackingId = logError(e, {
      message: "Error creating billing portal session in billing manage page",
    });
    error(500, { ...getDefaultErrorInfoObjectified({ trackingId }) });
  }

  if (!portalLink) {
    redirect(
      303,
      "/account/billing",
      {
        message: `Kunde inte hämta betalningshistorik. Försök igen lite senare.`,
        type: "error",
      },
      cookies,
    );
  }
  redirect(303, portalLink ?? "/account/billing");
}) satisfies PageServerLoad;
