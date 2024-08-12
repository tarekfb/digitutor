import type { PageServerLoad } from "./$types";
import { getGenericFormMessage, maxAvatarSize } from "$lib/shared/constants/constants";
import { fail, message, superValidate, withFiles } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { avatarSchema, emailSchema, nameSchema, type ProfileInput } from "$lib/shared/models/profile";
import { updateProfile } from "$lib/server/database/profiles";
import { updateUserEmail } from "$lib/server/database/user";
import { deleteAccountSchema, passwordSchema } from "$lib/shared/models/user";
import { isAuthApiError } from "@supabase/supabase-js";
import { redirect } from "sveltekit-flash-message/server";
import { uploadAvatar } from "src/lib/server/database/avatar";
import { formatBytes, isStorageErrorCustom } from "src/lib/utils";
import type { StorageErrorCustom } from "src/lib/shared/errors/storage-error-custom";
import { Buffer } from 'node:buffer';
// import { PhotonImage, SamplingFilter, resize } from "@cf-wasm/photon";

// For some reason, Jimp attaches to self, even in Node.
// https://github.com/jimp-dev/jimp/issues/466
import * as _Jimp from 'jimp';

// @ts-ignore
const Jimp = (typeof self !== 'undefined') ? (self.Jimp || _Jimp) : _Jimp;

export const load: PageServerLoad = async ({ parent, locals: { safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (!session)
        throw redirect(303, "/sign-in");

    const { profile } = await parent();
    const initName = {
        firstName: profile.first_name,
        lastName: profile.last_name
    }
    const updateNameForm = await superValidate(initName, zod(nameSchema));
    const updateEmailForm = await superValidate({ email: session.user.email }, zod(emailSchema));
    const deleteAccountForm = await superValidate(zod(deleteAccountSchema));
    const updatePasswordForm = await superValidate(zod(passwordSchema));
    const uploadAvatarForm = await superValidate(zod(avatarSchema));

    return { updateNameForm, updateEmailForm, deleteAccountForm, updatePasswordForm, uploadAvatarForm };
};

export const actions = {
    name: async (event) => {
        const { locals: { supabase, safeGetSession } } = event;
        const { user } = await safeGetSession();
        if (!user)
            throw redirect(303, "/sign-in");

        const form = await superValidate(event, zod(nameSchema));
        if (!form.valid) return fail(400, { form });
        const { firstName, lastName } = form.data;

        const profileInput: ProfileInput = {
            id: user.id,
            first_name: firstName,
            last_name: lastName
        }

        try {
            await updateProfile(supabase, profileInput);
            return { form }
        } catch (error) {
            console.error(`Error on update profile in update name with userid ${user.id}`, error);
            return message(form, getGenericFormMessage(), { status: 500 });
        }
    },
    email: async (event) => {
        const { locals: { supabase, safeGetSession } } = event;
        const { session } = await safeGetSession();
        if (!session)
            throw redirect(303, "/sign-in");

        const form = await superValidate(event, zod(emailSchema));
        if (!form.valid) return fail(400, { form });

        const { email } = form.data;
        try {
            await updateUserEmail(supabase, email);
            return message(form, getGenericFormMessage("success", "Bekräfta e-postadresserna", "Bekräfta ändringen på både gamla och nya e-postadresserna. Tills dess loggar du in med din nuvarande e-postadress."));
        } catch (error) {
            console.error(`Error on update profile in update name with userid ${session?.user.id}`, error);
            return message(form, getGenericFormMessage(), { status: 500 });
        }
    },
    avatar: async (event) => {
        const { locals: { supabase, safeGetSession } } = event;
        const { session, user } = await safeGetSession();
        if (!session)
            throw redirect(303, "/sign-in");

        const form = await superValidate(event, zod(avatarSchema));

        if (!form.valid) return fail(400, { form });
        const { avatar } = form.data;

        const arrayBuffer = await avatar.arrayBuffer();
        let input = Buffer.from(arrayBuffer);

        // let outputBuffer;
        try {
            // const inputImage = PhotonImage.new_from_byteslice(inputBuffer);

            // resize image using photon
            // const outputImage = resize(
            //     inputImage,
            //     500,
            //     500,
            //     SamplingFilter.Triangle
            // );

            // // get webp bytes
            // outputBuffer = outputImage.get_bytes_webp();

            let image = await Jimp.default.read(input);
            // if (uncompressedByteSize > maxAvatarUncompressedSize)
            image = image.quality(80)

            image = image.resize(500, 500);
            input = await image.getBufferAsync(Jimp.default.MIME_PNG    );
        } catch (err) {
            // if (uncompressedByteSize > maxAvatarUncompressedSize) {
            //     console.error('Unknown error on compression:', err);
            //     return message(form, getGenericFormMessage("destructive", "Något gick fel vid komprimeringen", `Testa ladda upp en bild under ${formatBytes(maxAvatarUncompressedSize)} så görs ingen komprimering.`), { status: 500 });
            // } else {
            console.error('Unknown error on resize:', err);
            return message(form, getGenericFormMessage(), { status: 500 });
            // }
        }

        let avatarPath;
        try {
            const format = avatar.type.split("/")[1]; // example type property: image/png
            const fileName = `${user.id}---${crypto.randomUUID()}.${format}`
            avatarPath = await uploadAvatar(supabase, fileName, input);
        } catch (error) {
            if (isStorageErrorCustom(error)) {
                const storageError = error as unknown as StorageErrorCustom;
                if (storageError.statusCode === '413') {
                    const bytes = Buffer.byteLength(input);
                    return message(form, getGenericFormMessage("destructive", "Filen är för stor", `Din fil är ${formatBytes(bytes)}, maxgränsen är ${formatBytes(maxAvatarSize)}.`), { status: 413 });
                }
            }
            console.error("Unknown error on upload avatar", error);
            return message(form, getGenericFormMessage(), { status: 500 });
        }

        try {
            await updateProfile(supabase, { id: user.id, avatar_url: avatarPath });
        } catch (error) {
            console.error(`Error on update profile with new avatar on path ${avatarPath} with userid ${user.id}`, error);
            return message(form, getGenericFormMessage(), { status: 500 });
        }
        return withFiles({ form });
    },
    delete: async (event) => {
        const { locals: { supabase, safeGetSession, supabaseServiceRole }, cookies } = event;
        const { user } = await safeGetSession();
        if (!user)
            throw redirect(303, "/sign-in");

        const form = await superValidate(event, zod(deleteAccountSchema));
        if (!form.valid) return fail(400, { form });
        const { password } = form.data;
        const { id, email } = user;
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
            throw redirect(303, "/settings_password_error");
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
            throw redirect(303, "/sign-in");

        const form = await superValidate(event, zod(passwordSchema));
        if (!form.valid) return fail(400, { form });

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
            throw redirect(303, "/settings_password_error");
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