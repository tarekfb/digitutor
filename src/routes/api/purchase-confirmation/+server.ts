import { json } from "@sveltejs/kit";
import { updateCredits } from "src/lib/server/database/credits.ts";
import { creditProducts } from "src/lib/shared/constants/constants.ts";
import type { RequestHandler } from "./$types.ts";
import { sendEmail } from "src/lib/shared/utils/emails/utils.ts";
import PurchaseConfirmation from "src/emails/purchase-confirmation.svelte";

export const POST: RequestHandler = async ({
  request,
  locals: { supabaseServiceRole },
}) => {
  const requestBody: unknown = await request.json();
  const requestBodyTyped = requestBody as {
    data: {
      object: {
        status: string;
        mode: string;
        metadata: {
          price_id: string;
          user_id: string;
        };
        customer_details: {
          name: string;
          email: string;
        }
      };
    };
  };

  const customerEmail = requestBodyTyped.data.object.customer_details.email;
  const customerName = requestBodyTyped.data.object.customer_details.name ?? ""; // should always be present, but null check for precaution
  const status = requestBodyTyped.data.object.status;
  const mode = requestBodyTyped.data.object.mode;

  if (status === "complete") {
    const metadata = requestBodyTyped.data.object.metadata;
    const priceId = metadata.price_id;
    const userId = metadata.user_id;

    const matchedProduct = creditProducts.find(
      (product) => product.stripePriceId === priceId,
    );
    if (!matchedProduct) {
      console.error(
        "Unexpected error: product not found.",
        { userId },
        { priceId },
        { matchedProduct },
      );
    }

    if (customerEmail) {
      try {
        const { error: sendError } = await sendEmail(PurchaseConfirmation, [customerEmail], "Tack för ditt köp", { userName: customerName, priceId })
        if (sendError)
          console.error(`Error sending email for deleted acc ${userId}`, sendError);
      } catch (e) {
        console.error(`Error sending email for deleted acc ${userId}`, e);
      }
    } else console.error(`Missing email, unable to send confirmation email for userid ${userId}`);
    // shouldnt happen but we dont own the API, safeguarding against future changes 

    if (mode === "payment" && matchedProduct) {
      try {
        await updateCredits(supabaseServiceRole, matchedProduct.credits, userId);
      } catch (e) {
        console.error(
          `Critical error: after completing payment and trying to add credit value of ${matchedProduct.credits}. User ${userId} most likely didnt receive their ${matchedProduct.credits} credits`,
          { metadata },
          { userId },
          e,
        );
        return json({ success: false, status: 500 });
      }
    }
  }

  return json({ success: true });
};
