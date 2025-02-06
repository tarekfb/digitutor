import type { PageServerLoad } from './$types.ts';

export const load = (async () => {
    // const subscription = await getSubscription();
    const subscription = null;
    return { subscription };
}) satisfies PageServerLoad;