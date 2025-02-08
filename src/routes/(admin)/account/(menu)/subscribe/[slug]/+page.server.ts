import { PRIVATE_STRIPE_API_KEY } from "$env/static/private"
import { error, redirect } from "@sveltejs/kit"
import Stripe from "stripe"

import { getOrCreateCustomerId, fetchSubscription } from "src/lib/shared/utils/subscription/subscription-helper.ts"
import { getDefaultErrorInfo } from "src/lib/shared/constants/constants.ts"
import type { PageServerLoad } from "./$types.ts"

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY)
// { apiVersion: "2023-08-16" }

export const load: PageServerLoad = async ({
    params: { slug },
    url,
    locals: { safeGetSession, supabaseServiceRole, supabase },
}) => {
    const { session, user } = await safeGetSession()
    if (!session) {
        redirect(303, "/sign-in") // todo add flash
    }

    const successUrl = "/account/billing";

    // free plan. simulate success by redirecting to success url
    if (slug === "free") redirect(303, successUrl)

    const { error: idError, customerId } = await getOrCreateCustomerId({
        supabaseServiceRole,
        user,
    })
    if (idError || !customerId) {
        console.error("Error creating customer id", idError)
        error(500, getDefaultErrorInfo())
    }

    const { primarySubscription } = await fetchSubscription({
        customerId,
    })
    if (primarySubscription) {
        // User already has plan, we shouldn't let them buy another
        redirect(303, successUrl) // todo add flash
    }

    const mode = url.searchParams.get("mode") === "payment" ? "payment" : "subscription"; // if credits, then single purchase

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
        })
        checkoutUrl = stripeSession.url
    } catch (e) {
        console.error("Error creating checkout session", e)
        error(500, getDefaultErrorInfo())
    }

    redirect(303, checkoutUrl ?? "/pricing") // stripe takes over checkout process
}