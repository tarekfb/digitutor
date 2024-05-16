import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { unknownErrorMessage } from "src/lib/constants";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { signUpSchema, type CreateProfile } from "src/lib/models/user";
import { createProfile } from "src/lib/server/database/profiles";

export const ssr = false;


export const load: PageServerLoad = async ({ locals: { getSession } }) => {
    try {
        const session = await getSession();
        if (session)
            throw redirect(303, "/account");

        const form = await superValidate(zod(signUpSchema))
        return { form };
    } catch (e) {
        console.error("Error when loading signup", e);
        throw error(500, {
            message: unknownErrorMessage,
        });
    };
}

export const actions = {
    default: async (event) => {
        const { locals: { supabase, getSession } } = event;
        const session = await getSession();
        if (session)
            throw redirect(303, "/account");

        const form = await superValidate(event, zod(signUpSchema));
        const { email, password, role, first_name, last_name } = form.data;
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }


        let inputUser: CreateProfile;
        try {
            const { data, error } = await supabase.auth.signUp({
                email, password
            })

            if (error) {
                console.error("Supabase error on signup", { error });
                return fail(500, { message: unknownErrorMessage, form })
            }
            console.log("hit")

            if (!data.user) {
                console.error("User data was null on signup", error);
                return fail(500, { message: unknownErrorMessage, form })
            }

            // https://github.com/orgs/supabase/discussions/1282
            if (data.user.identities && data.user.identities.length === 0)
                return fail(400, { message: "E-postadressen används redan.", form })

            inputUser = {
                id: data.user.id,
                role,
                firstName: first_name,
                lastName: last_name,
            }

        } catch (error) {
            console.error("Error when creating supabase auth user", error);
            return fail(500, {
                message: unknownErrorMessage, form,
            });
        }

        try {
            const createdUser = await createProfile(supabase, inputUser)
            console.log("createduser")
            console.log(createdUser.id)
            return message(form, 'Vänligen bekräfta din e-postadress.');
        } catch (error) {
            console.error("Error when creating profile", error);
            return fail(500, {
                message: unknownErrorMessage, form,
            });
        }
    }
}

// async function submit() {
//     error = ''
//     message = ''
//     loading = true

//     if (view == 'sign_up') {
//         const { error: signUpError } = await supabaseClient.auth.signUp({
//             email, password
//         })

//         if (signUpError) error = signUpError.message
//     } else if (view == 'sign_in') {
//         const { error: signInError } = await supabaseClient.auth.signIn({
//             email, password
//         })

//         if (signInError) error = signInError.message
//     }

//     loading = false
// }