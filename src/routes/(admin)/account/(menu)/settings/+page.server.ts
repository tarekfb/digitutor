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

    const deleteAccountForm = await superValidate({ id: session.user.id }, zod(deleteAccountSchema));

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
            return fail(400, { nameForm: form });

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
            return { nameForm: form }
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
        const { locals: { supabase, getSession } } = event;
        const session = await getSession();
        if (!session)
            throw redirect(303, "/login");

        const form = await superValidate(event, zod(deleteAccountSchema));
        if (!form.valid)
            return fail(400, { form });

        setTimeout(async () => {
            return message(form, getGenericErrorMessage(), { status: 500 });

        }, 3000)

        // const currentPassword = formData.get("currentPassword") as string;

        // if (!currentPassword) {
        //     return fail(400, {
        //         errorMessage:
        //             "You must provide your current password to delete your account. If you forgot it, sign out then use 'forgot password' on the sign in page.",
        //         errorFields: ["currentPassword"],
        //         currentPassword,
        //     });
        // }

        // // Check current password is correct before deleting account
        // const { error: pwError } = await supabase.auth.signInWithPassword({
        //     email: session?.user.email || "",
        //     password: currentPassword,
        // });
        // if (pwError) {
        //     // The user was logged out because of bad password. Redirect to error page explaining.
        //     throw redirect(303, "/login/current_password_error");
        // }

        // const { error } = await supabaseServiceRole.auth.admin.deleteUser(
        //     session.user.id,
        //     true,
        // );
        // if (error) {
        //     return fail(500, {
        //         errorMessage: unknownErrorMessage,
        //         currentPassword,
        //     });
        // }

        // await supabase.auth.signOut();
        // throw redirect(303, "/");
    },
}