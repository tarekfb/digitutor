import {
  getOrCreateCustomerId,
  fetchSubscription,
} from "src/lib/shared/utils/subscription/subscription-helper.ts";
import type { PageServerLoad } from "./$types.ts";
import { error } from "@sveltejs/kit";
import {
  defaultPlanId,
  getDefaultErrorInfo,
  getDefaultErrorInfoObjectified,
  websiteName,
} from "src/lib/shared/constants/constants.ts";
import { getCreditsByStudent } from "src/lib/server/database/credits.ts";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { PricingPlanIds } from "src/lib/shared/models/subscription.ts";
import { logError } from "src/lib/shared/utils/logging/utils.ts";

export const load: PageServerLoad = (async (event) => {
  const {
    locals: { supabaseServiceRole, safeGetSession },
    parent,
    cookies,
    url
  } = event;
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

  const { session, user } = await safeGetSession();
  if (!session || !user?.id) redirect(303, "/sign-in");

  const { error: idError, customerId } = await getOrCreateCustomerId({
    supabaseServiceRole,
    user,
  });
  if (idError || !customerId) {
    const trackingId = logError(idError, {
      message: "Error creating customer id",
    });
    error(500, { ...getDefaultErrorInfoObjectified({ trackingId }) });
  }

  const {
    primarySubscription,
    hasEverHadSubscription,
    error: fetchErr,
  } = await fetchSubscription({ customerId });

  if (fetchErr) {
    const trackingId = logError(fetchErr, {
      message: "Error while fetching subscription for account billing page",
    });
    error(500, { ...getDefaultErrorInfoObjectified({ trackingId }) });
  }

  let balance: number | undefined;
  try {
    balance = await getCreditsByStudent(supabaseServiceRole, user.id);
  } catch (error) {
    logError(error, {
      message: "Error while fetching credits for account billing page",
    });
  }

  const currentPlanId = primarySubscription?.appSubscription?.id || defaultPlanId;
  if (currentPlanId === PricingPlanIds.Free && url.searchParams.get("plan") === "free")
    setFlash({ message: "Din nuvarande plan är redan: Gratis ", type: "info" }, event);

  return {
    isActiveCustomer: !!primarySubscription,
    hasEverHadSubscription,
    currentPlanId,
    balance,
  };
}) satisfies PageServerLoad;
