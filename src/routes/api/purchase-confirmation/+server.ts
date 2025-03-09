import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.ts";
import { sendEmail } from "src/lib/shared/utils/emails/utils.ts";
import PurchaseConfirmation from "src/emails/purchase-confirmation.svelte";
import { logErrorServer } from "src/lib/shared/utils/logging/utils.ts";

export const POST: RequestHandler = async ({
  request,
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
  // const mode = requestBodyTyped.data.object.mode;

  if (status === "complete") {
    const metadata = requestBodyTyped.data.object.metadata;
    const priceId = metadata.price_id;
    const userId = metadata.user_id;

    const matchedProduct = undefined;
    // if in future need to display information on a single purchase with metadata mode: payment
    // do a find like this on products list as static object. 
    // creditProducts.find(
    //   (product) => product.stripePriceId === priceId,
    // );
    // then update db if needed like this. 
    // probably at end of this post request.
    // if (mode === "payment" && matchedProduct) {
    //   try {
    //     await updateCredits(supabaseServiceRole, matchedProduct.credits, userId);
    //   } catch (e) {
    //     logErrorServer({
    //       error: e,
    //       message: `After completing payment and trying to add credit value of ${matchedProduct.credits}. User ${userId} most likely didnt receive their ${matchedProduct.credits} credits`,
    //       additionalData: {
    //         metadata,
    //         userId,
    //         matchedProduct
    //       },
    //       critical: true,
    //     });
    //     return json({ success: false, status: 500 });
    //   }
    // }

    if (!matchedProduct) {
      logErrorServer({
        message: "Unexpected error: product not found.",
        additionalData: {
          userId,
          priceId,
          matchedProduct,
        },
        critical: true
      });
    }

    if (customerEmail) {
      try {
        const { error: sendError } = await sendEmail(PurchaseConfirmation, [customerEmail], "Tack för ditt köp", { userName: customerName, priceId })
        if (sendError)
          logErrorServer({
            error: sendError,
            message: `Error sending email for purchase confirmation ${userId}`,
            additionalData: {
              metadata,
              userId,
              customerEmail
            },
            critical: true,
          });
      } catch (e) {
        logErrorServer({
          error: e,
          message: `Error sending email for purchase confirmation ${userId}`,
          additionalData: {
            metadata,
            userId,
            customerEmail
          },
          critical: true,
        });
      }
    } else logErrorServer({ message: `Missing email, unable to send confirmation email for userid ${userId}` });
    // shouldnt happen but we dont own the API, safeguarding against future changes 
  }

  return json({ success: true });
};
