import type { EmailOtpType } from '@supabase/supabase-js'
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const { locals: { safeGetSession } } = event;
    const { user, session } = await safeGetSession();

    if (!session || !user) {
        // todo setflash explanation
        // redirect(
        //     303,
        //     '/listing/0196cf3d-e0a6-49e6-aa98-6957ebe80e0f', // todo: go to /login
        //     { message: 'Test', type: 'warning' },
        //     event
        // )
        throw redirect(303, "/login");
    }

    const { url, locals: { supabase } } = event;
    const token_hash = url.searchParams.get('token_hash')
    const type = url.searchParams.get('type') as EmailOtpType | null
    const next = url.searchParams.get('next') ?? '/'

    /**
     * Clean up the redirect URL by deleting the Auth flow parameters.
        *
     * `next` is preserved for now, because it's needed in the error case.
     */
    const redirectTo = new URL(url)
    redirectTo.pathname = next
    redirectTo.searchParams.delete('token_hash')
    redirectTo.searchParams.delete('type')

    if (token_hash && type) {
        const { error: e } = await supabase.auth.verifyOtp({ type, token_hash })

        // if (e){
        //     redirect(
        //     303,
        //     '/',
        //     { message: 'Test', type: 'error' },
        //     event
        // )        // user was logged out because of bad password. Redirect to error page with explaination.

        if (e){
            console.log("error")
            // redirect(303, '/login/sign_in', { message: 'Test', type: 'error' }, event)
            error(500, {
                message: "Vi försökte verifiera dig men någonting gick fel. Försök igen senare.",
            });
        }

        redirectTo.searchParams.delete('next')
        // setFlash({ type: 'success', message: 'ok' }, event);
        return { email: user.email };       
    }

    throw error(500, {
        message: "Det saknas lite info för att verifiera dig. Försök igen senare.",
    });
    // redirectTo.pathname = '/auth/error'
    // return redirect(303, redirectTo)

}


// export const GET: RequestHandler = async (event) => {
   
// }