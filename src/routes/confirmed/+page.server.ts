import type { EmailOtpType } from '@supabase/supabase-js'
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { unknownErrorMessage } from '$lib/shared/constants/constants';

export const load: PageServerLoad = async (event) => {
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
        const { error: e, data: { user } } = await supabase.auth.verifyOtp({ type, token_hash })

        // if (e){
        //     redirect(
        //     303,
        //     '/',
        //     { message: 'Test', type: 'error' },
        //     event
        // )        // user was logged out because of bad password. Redirect to error page with explaination.

        if (e) {
            console.error("Unknown error on verify otp on email confirmation", e);
            // redirect(303, '/sign-in', { message: 'Test', type: 'error' }, event)
            error(500, {
                message: "Vi försökte verifiera dig men någonting gick fel. Försök igen senare.",
            });
        }

        if (!user) {
            console.error("User data was null on verify otp on email confirmation", e);
            error(500, unknownErrorMessage);
        }

        redirectTo.searchParams.delete('next')
        return { email: user.email };
    }

    error(500, {
            message: "Det saknas lite info för att verifiera dig.",
        });
    // redirectTo.pathname = '/error'
    // return redirect(303, redirectTo)

}