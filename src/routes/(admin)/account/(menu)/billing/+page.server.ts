import { getOrCreateCustomerId, fetchSubscription } from 'src/lib/shared/utils/subscription/subscription-helper.ts';
import type { PageServerLoad } from './$types.ts';
import { error } from "@sveltejs/kit"
import { getDefaultErrorInfo, websiteName } from 'src/lib/shared/constants/constants.ts';
import { getCreditsByStudent, updateCredits } from 'src/lib/server/database/credits.ts';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = (async ({ locals: { supabaseServiceRole, safeGetSession }, parent, cookies }) => {
    const { profile } = await parent();
    if (profile.role === 'teacher') redirect(303, "/account", { type: "info", message: `Du är lärare och betalar därför ingenting för att använda ${websiteName}.` }, cookies);

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

    let balance: number | undefined;
    try {
        balance = await getCreditsByStudent(supabaseServiceRole, user.id)
    } catch (error) {
        console.error("Error fetching credits", error)
        balance = undefined;
    }

    return {
        isActiveCustomer: !!primarySubscription,
        hasEverHadSubscription,
        currentPlanId: primarySubscription?.appSubscription?.id,
        balance,
    }
}) satisfies PageServerLoad;