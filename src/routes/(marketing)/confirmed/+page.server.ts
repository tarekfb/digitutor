import { redirect } from 'sveltekit-flash-message/server'

export const load = async (event) => {
    const { locals: { safeGetSession } } = event;
    const { user, session } = await safeGetSession();


    if (!session || !user) {
        // todo setflash explanation
        redirect(
            303,
            '/login',
            { message: 'Test', type: 'warning' },
            event
        )
        // throw redirect(303, "/login");
    }

    return { email: user.email };
}