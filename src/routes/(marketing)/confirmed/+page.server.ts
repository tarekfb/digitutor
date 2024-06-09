import { redirect } from "@sveltejs/kit";

export const load = async ({ locals: { safeGetSession } }) => {
    const { user, session } = await safeGetSession();
    if (!session || !user) {
        // todo setflash explanation
        throw redirect(303, "/login");
    }
    
    return { email: user.email };
}