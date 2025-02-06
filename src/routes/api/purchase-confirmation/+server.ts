import { json } from '@sveltejs/kit';
import { updateCredits } from 'src/lib/server/database/credits.ts';
import { creditProducts } from 'src/lib/shared/constants/constants.ts';
import type { RequestHandler } from './$types.ts';

export const POST: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
    const requestBody: any = await request.json();
    const customerEmail = requestBody.data.object.customer_details.email;
    const customerName = requestBody.data.object.customer_details.name;
    const status = requestBody.data.object.status;
    const mode = requestBody.data.object.mode;

    if (status === "complete" && mode === "payment") {
        const metadata = requestBody.data.object.metadata;
        const priceId = metadata.price_id;
        const userId = metadata.userId;
        const { session } = await safeGetSession();
        const userIdFromOther = session?.user.id;

        console.log("userIdFromOther", userIdFromOther)
        console.log("userId from metadata", userId)
        console.log("priceId from metadata", priceId)
        console.log("metadata", metadata)

        const matchedProduct = creditProducts.find((product) => product.stripePriceId === priceId);
        if (!matchedProduct) {
            console.error("Unexpected error: product not found.", userId, priceId, matchedProduct);
            return json({ success: false, status: 404 });
        }

        console.log("matchedProduct inside if matchedProduct", matchedProduct)
        try {
            await updateCredits(supabase, matchedProduct.credits, userId)
            console.log("after awiat complketed")
        } catch (e) {
            console.error(`Critical error: after completing payment and trying to add credit value of ${matchedProduct.credits}. User ${userId} most likely didnt receive their ${matchedProduct.credits} credits`, e)
            return json({ success: false, status: 500 });
        }

    }
    console.log({ customerEmail, customerName, status });
    return json({ success: true });
}


// const sessionId = requestBody.data.object.id;
// const stripe = new Stripe(PRIVATE_STRIPE_API_KEY)
// const { line_items } = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });

// const productIdCheckout = line_items?.data[0]?.price?.product;