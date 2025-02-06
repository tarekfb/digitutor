import { PRIVATE_STRIPE_API_KEY } from "$env/static/private"
import { error, redirect } from "@sveltejs/kit"
import Stripe from "stripe"

import { getOrCreateCustomerId, fetchSubscription } from "src/lib/shared/utils/subscription/subscription-helper"
import { getDefaultErrorInfo } from "src/lib/shared/constants/constants"
import type { PageServerLoad } from "./$types"
import { creditProducts } from "src/lib/shared/constants/constants.js"
import { updateCredits } from "src/lib/server/database/credits.js"

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

    console.log("stripeSession before", stripeSession)
    if (stripeSession.status === "complete" && mode === "payment") {
        console.log("stripeSession inside if", stripeSession)
        const product = creditProducts.find(slug);
        if (product) {
            console.log("product inside if product", product)
            try {
                await updateCredits(supabase, product.credits, session)
                console.log("after awiat", stripeSession)

            } catch (e) {
                console.error(`Critical error: after completing payment and trying to add credit value of ${product.credits}. User ${user.id} most likely didnt receive their ${product.credits} credits`, e)
                error(500, getDefaultErrorInfo(undefined, "Om du inte fick dina krediter kan du kontakta oss."))
            }
        }
    }

    redirect(303, checkoutUrl ?? "/pricing")
}
