import { json } from '@sveltejs/kit';
import { updateCredits } from 'src/lib/server/database/credits.ts';
import { creditProducts } from 'src/lib/shared/constants/constants.ts';
import type { RequestHandler } from './$types.ts';

export const POST: RequestHandler = async ({ request, locals: { supabaseServiceRole } }) => {
    const requestBody: any = await request.json();
    // const customerEmail = requestBody.data.object.customer_details.email;
    // const customerName = requestBody.data.object.customer_details.name;
    const status = requestBody.data.object.status;
    const mode = requestBody.data.object.mode;

    if (status === "complete" && mode === "payment") {
        const metadata = requestBody.data.object.metadata;
        const priceId = metadata.price_id;
        const userId = metadata.user_id;

        const matchedProduct = creditProducts.find((product) => product.stripePriceId === priceId);
        if (!matchedProduct) {
            console.error("Unexpected error: product not found.", userId, priceId, matchedProduct);
            return json({ success: false, status: 404 });
        }

        try {
            await updateCredits(supabaseServiceRole, matchedProduct.credits, userId)
        } catch (e) {
            console.error(`Critical error: after completing payment and trying to add credit value of ${matchedProduct.credits}. User ${userId} most likely didnt receive their ${matchedProduct.credits} credits`, {metadata}, {userId},e)
            return json({ success: false, status: 500 });
        }

    }

    return json({ success: true });
}
