import { PRIVATE_STRIPE_API_KEY } from "$env/static/private"
import { error } from "@sveltejs/kit"
import Stripe from "stripe"
import type { PageServerLoad } from "./$types"
import { getDefaultErrorInfo } from 'src/lib/shared/constants/constants';
import { getOrCreateCustomerId } from "src/lib/shared/utils/subscription/subscription-helper";
import { redirect } from "sveltekit-flash-message/server";

// , { apiVersion: "2023-08-16" }
const stripe = new Stripe(PRIVATE_STRIPE_API_KEY)

export const load = (async ({
    url,
    locals: { safeGetSession, supabaseServiceRole },
    cookies
}) => {

    const { session, user } = await safeGetSession()
    if (!session) {
        redirect(303, "/login")
    }

    const { error: idError, customerId } = await getOrCreateCustomerId({
        supabaseServiceRole,
        user,
    })
    if (idError || !customerId) {
        console.error("Error creating customer id", idError)
        error(500, getDefaultErrorInfo());
    }

    let portalLink;
    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${url.origin}/account/billing`,
        })
        portalLink = portalSession?.url
    } catch (e) {
        console.error("Error creating billing portal session", e)
        error(500, getDefaultErrorInfo());
    }

    if (!portalLink) {
        redirect(303, "/account/billing", {
            message: `Kunde inte hämta betalningshistorik. Försök igen lite senare.`,
            type: "error"
        }, cookies)
    }
    redirect(303, portalLink ?? "/account/billing")

}) satisfies PageServerLoad;



