import { PRIVATE_STRIPE_API_KEY } from "$env/static/private"
import { error, redirect } from "@sveltejs/kit"
import Stripe from "stripe"

import { getOrCreateCustomerId, fetchSubscription } from "src/lib/shared/utils/subscription/subscription-helper"
import { getDefaultErrorInfo } from "src/lib/shared/constants/constants"
import type { PageServerLoad } from "./$types"

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY)
// { apiVersion: "2023-08-16" }

export const load: PageServerLoad = async ({
    params: { slug },
    url,
    locals: { safeGetSession, supabaseServiceRole },
}) => {
    const { session, user } = await safeGetSession()
    if (!session) {
        redirect(303, "/sign-in")
    }

    const successUrl = "/account/billing";

    if (slug === "free") {
        // free plan. simulate success by redirecting to success url
        redirect(303, "successUrl")
    }

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
        redirect(303, "successUrl")
    }

    let checkoutUrl
    try {
        const stripeSession = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: slug,
                    quantity: 1,
                },
            ],
            customer: customerId,
            mode: "subscription",
            success_url: `${url.origin}${successUrl}`,
            cancel_url: `${url.origin}${successUrl}`,
        })
        checkoutUrl = stripeSession.url
    } catch (e) {
        console.error("Error creating checkout session", e)
        error(500, getDefaultErrorInfo())
    }

    redirect(303, checkoutUrl ?? "/pricing")
}
