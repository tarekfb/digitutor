import { getOrCreateCustomerId, fetchSubscription } from 'src/lib/shared/utils/subscription/subscription-helper';
import type { PageServerLoad } from './$types';
import { error, redirect } from "@sveltejs/kit"
import { getDefaultErrorInfo } from 'src/lib/shared/constants/constants';

export const load: PageServerLoad = (async ({ locals: { supabaseServiceRole, safeGetSession } }) => {
    // const subscription = await getSubscription();
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) redirect(303, "/sign-in")

    const { error: idError, customerId } = await getOrCreateCustomerId({
        supabaseServiceRole,
        user,
    })
    if (idError || !customerId) {
        console.error("Error creating customer id", idError)
        error(500, getDefaultErrorInfo())
    }

    const { primarySubscription, hasEverHadSubscription, error: fetchErr } = await fetchSubscription({ customerId })

    if (fetchErr) {
        console.error("Error fetching subscription", fetchErr)
        error(500, getDefaultErrorInfo())
    }

    return {
        isActiveCustomer: !!primarySubscription,
        hasEverHadSubscription,
        currentPlanId: primarySubscription?.appSubscription?.id,
    }
}) satisfies PageServerLoad;

