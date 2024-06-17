import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getGenericFormMessage } from "$lib/shared/constants/constants";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { emailSchema, nameSchema } from "$lib/shared/models/profile";
import { getProfileBySession, updateProfile } from "$lib/server/database/profiles";
import type { Tables } from "src/supabase";
import { updateUserEmail } from "$lib/server/database/user";
import { deleteAccountSchema, passwordSchema } from "$lib/shared/models/user";
import { isAuthApiError } from "@supabase/supabase-js";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async (parentData) => {
    const { profile, session } = await parentData.parent();
    if (!session)
        throw redirect(303, "/auth");

    const initName = {
        firstName: profile.first_name,
        lastName: profile.last_name
    }
    const updateNameForm = await superValidate(initName, zod(nameSchema));
    const updateEmailForm = await superValidate({ email: session.user.email }, zod(emailSchema));
    const deleteAccountForm = await superValidate(zod(deleteAccountSchema));
    const updatePasswordForm = await superValidate(zod(passwordSchema));

    return { updateNameForm, updateEmailForm, deleteAccountForm, updatePasswordForm };
};

export const actions = {
    name: async (event) => {
        const { locals: { supabase, safeGetSession } } = event;
        const { session } = await safeGetSession();
        if (!session)
            throw redirect(303, "/auth");

        const form = await superValidate(event, zod(nameSchema));
        if (!form.valid)
            return fail(400, { form });

        const { firstName, lastName } = form.data;

        let profile;
        try {
            profile = await getProfileBySession(supabase, session)
        } catch (error) {
            console.error(`Error on fetch profile in update name with userid ${session.user.id}`, error);
            return message(form, getGenericFormMessage(), { status: 500 });
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
            return message(form, getGenericFormMessage(), { status: 500 });
        }
    },
    email: async (event) => {
        const { locals: { supabase, safeGetSession } } = event;
        const { session } = await safeGetSession();
        if (!session)
            throw redirect(303, "/auth");

        const form = await superValidate(event, zod(emailSchema));
        if (!form.valid)
            return fail(400, { nameForm: form });

        const { email } = form.data;
        try {
            await updateUserEmail(supabase, email);
            return message(form, getGenericFormMessage("success", "Bekräfta e-postadresserna", "Bekräfta ändringen på både gamla och nya e-postadresserna. Tills dess loggar du in med din nuvarande e-postadress."));
        } catch (error) {
            console.error(`Error on update profile in update name with userid ${session?.user.id}`, error);
            return message(form, getGenericFormMessage(), { status: 500 });
        }
    },
    delete: async (event) => {
        const { locals: { supabase, safeGetSession, supabaseServiceRole }, cookies } = event;
        const { session } = await safeGetSession();
        if (!session)
            throw redirect(303, "/auth");

        const form = await superValidate(event, zod(deleteAccountSchema));
        if (!form.valid)
            return fail(400, { form });

        const { password } = form.data;
        const { id, email } = session.user;
        if (!email) {
            console.error(`User with id ${id} has no email and therefore password could not be verified`);
            return message(form, getGenericFormMessage(), { status: 500 });
        }

        // Check current password is correct before deleting account
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error)
            throw redirect(303, "/auth/settings_password_error");
        // user was logged out because of bad password. Redirect to error page with explaination.

        try {
            const { error } = await supabaseServiceRole.auth.admin.deleteUser(
                id,
                false,
            );
            if (error) {
                console.error(`Error on attempt to delete user with userid ${id}`, error);
                return message(form, getGenericFormMessage(), { status: 500 });
            }

            await supabase.auth.signOut();
        } catch (e) {
            console.error(`Error on attempt to delete & signout user with userid ${id}`, e);
            return message(form, getGenericFormMessage(), { status: 500 });
        }

        throw redirect(303, `/`, { message: 'Ditt konto har raderats.', type: 'success' }, cookies);
    },
    password: async (event) => {
        const { locals: { supabase, safeGetSession } } = event;
        const { session } = await safeGetSession();
        if (!session)
            throw redirect(303, "/auth");

        const form = await superValidate(event, zod(passwordSchema));
        if (!form.valid)
            return fail(400, { form });

        const { new: newPassword, current } = form.data;

        const { id, email } = session.user;
        if (!email) {
            console.error(`User with id ${id} has no email and therefore password could not be verified`);
            return message(form, getGenericFormMessage(), { status: 500 });
        }
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: current,
        });

        if (error)
            throw redirect(303, "/auth/settings_password_error");
        // user was logged out because of bad password. Redirect to error page with explaination.


        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (updateError) {
            const isSameAsCurrent = isAuthApiError(updateError) && updateError.status === 422 && updateError.message.includes("different")
            if (isSameAsCurrent)
                return message(form, getGenericFormMessage(undefined, "Ange ett nytt lösenord", "Det angivna lösenordet är samma som det nuvarande."), { status: 500 });

            console.error(`Error on attempt to update password with userid ${id}`, updateError);
            return message(form, getGenericFormMessage(), { status: 500 });
        }
        return message(form, getGenericFormMessage("success", "Lösenord ändrat", "Använd det nya lösenordet nästa gång du loggar in."));
    }
}