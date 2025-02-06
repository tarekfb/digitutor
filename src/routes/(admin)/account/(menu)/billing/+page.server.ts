import { getOrCreateCustomerId, fetchSubscription } from 'src/lib/shared/utils/subscription/subscription-helper.ts';
import type { PageServerLoad } from './$types.ts';
import { error, redirect } from "@sveltejs/kit"
import { getDefaultErrorInfo } from 'src/lib/shared/constants/constants.ts';
import { getCreditsByStudent, updateCredits } from 'src/lib/server/database/credits.ts';

export const load: PageServerLoad = (async ({ locals: { supabaseServiceRole, safeGetSession, supabase } }) => {
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
        const credits = await getCreditsByStudent(supabase, user.id)
        balance = credits?.balance ?? 0;
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

export const actions = {
    "add-credits": async (event) => {
        const {
            locals: { supabase, safeGetSession },
        } = event;

        const { session } = await safeGetSession();
        if (!session) throw redirect(303, "/sign-in");
        const amount = 5;


        updateCredits(supabase, amount, session.user.id, `Testing credits feature.`);
    },
    "remove-credits": async (event) => {
        const {
            locals: { supabase, safeGetSession },
        } = event;

        const { session } = await safeGetSession();
        if (!session) throw redirect(303, "/sign-in");
        const amount = -5;


        updateCredits(supabase, amount, session.user.id, `Testing credits feature.`);
    },
};