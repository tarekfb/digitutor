import { redirect } from '@sveltejs/kit';
import { getConversations } from "$lib/server/database/conversations";
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase, safeGetSession }, parent }) => {
    const { session } = await safeGetSession();
    if (!session)
        redirect(303, '/sign-in');

    const conversations = await getConversations(supabase, session.user.id);
    const { profile: { role } } = await parent();

    if (role === 'student')
        redirect(303, '/account');

    return { conversations }

}) satisfies PageServerLoad;