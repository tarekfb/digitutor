import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getGenericErrorMessage, unknownErrorMessage } from "src/lib/constants";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { emailSchema, nameSchema } from "src/lib/models/profile";
import { getProfileBySession, updateProfile } from "src/lib/server/database/profiles";
import type { Tables } from "src/supabase";
import { updateUserEmail } from "src/lib/server/database/user";
import { deleteAccountSchema } from "src/lib/models/user";

export const load: PageServerLoad = async (parentData) => {
    const { profile, session } = await parentData.parent();
    if (!session)
        throw redirect(303, "/login");

    const initName = {
        firstName: profile.first_name,
        lastName: profile.last_name
    }
    const updateNameForm = await superValidate(initName, zod(nameSchema));
    const updateEmailForm = await superValidate({ email: session.user.email }, zod(emailSchema));
    const deleteAccountForm = await superValidate(zod(deleteAccountSchema));

    return { updateNameForm, updateEmailForm, deleteAccountForm };
};

export const actions = {
    name: async (event) => {
        const { locals: { supabase, getSession } } = event;
        const session = await getSession();
        if (!session)
            throw redirect(303, "/login");

        const form = await superValidate(event, zod(nameSchema));
        if (!form.valid)
            return fail(400, { form });

        const { firstName, lastName } = form.data;

        let profile;
        try {
            profile = await getProfileBySession(supabase, session)
        } catch (error) {
            console.error(`Error on fetch profile in update name with userid ${session.user.id}`, error);
            return message(form, getGenericErrorMessage(), { status: 500 });
        }

        const profileInput: Tables<"profiles"> = {
            ...profile,
            first_name: firstName,
            last_name: lastName
        }

        try {
            await updateProfile(supabase, profileInput);
            return { form }
        } catch (error) {
            console.error(`Error on update profile in update name with userid ${session.user.id}`, error);
            return message(form, getGenericErrorMessage(), { status: 500 });
        }
    },
    email: async (event) => {
        const { locals: { supabase, getSession } } = event;
        const session = await getSession();
        if (!session)
            throw redirect(303, "/login");

        const form = await superValidate(event, zod(emailSchema));
        if (!form.valid)
            return fail(400, { nameForm: form });

        const { email } = form.data;
        try {
            await updateUserEmail(supabase, email);
            return message(form, getGenericErrorMessage("success", "Bekräfta e-postadresserna", "Bekräfta ändringen på både gamla och nya e-postadresserna. Tills dess loggar du in med din nuvarande e-postadress."));
        } catch (error) {
            console.error(`Error on update profile in update name with userid ${session?.user.id}`, error);
            return message(form, getGenericErrorMessage(), { status: 500 });
        }
    },
    delete: async (event) => {
        const { locals: { supabase, getSession, supabaseServiceRole } } = event;
        const session = await getSession();
        if (!session)
            throw redirect(303, "/login");

        const form = await superValidate(event, zod(deleteAccountSchema));
        if (!form.valid)
            return fail(400, { form });

        await new Promise(resolve => setTimeout(resolve, 2500));


        const { password } = form.data;
        const { id, email } = session.user;
        if (!email) {
            console.error(`User with id ${id} has no email and therefore password could not be verified`);
            return message(form, getGenericErrorMessage(), { status: 500 });
        }

        // Check current password is correct before deleting account
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error)
            throw redirect(303, "/login/current_password_error");
        // user was logged out because of bad password. Redirect to error page with explaination.


        try {
            const { error } = await supabaseServiceRole.auth.admin.deleteUser(
                id,
                true,
            );
            if (error) {
                console.error(`Error on attempt to delete user with userid ${id}`, error);
                return message(form, getGenericErrorMessage(), { status: 500 });
            }

            await supabase.auth.signOut();
        } catch (e) {
            console.error(`Error on attempt to delete & signout user with userid ${id}`, e);
            return message(form, getGenericErrorMessage(), { status: 500 });
        }

        throw redirect(303, "/");
    },
}