import type { PageServerLoad } from "./$types";
import {
  getFailFormMessage,
  getSuccessFormMessage,
  maxAvatarSize,
} from "$lib/shared/constants/constants";
import { fail, message, superValidate, withFiles } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
  avatarSchema,
  deleteAvatarSchema,
  emailSchema,
  nameSchema,
  updateBioSchema,
  type ProfileInput,
} from "$lib/shared/models/profile";
import { updateProfile } from "$lib/server/database/profiles";
import { updateUserEmail } from "$lib/server/database/user";
import { deleteAccountSchema, changePasswordSchema } from "$lib/shared/models/user";
import { isAuthApiError } from "@supabase/supabase-js";
import { redirect } from "sveltekit-flash-message/server";
import { deleteAvatar, uploadAvatar } from "src/lib/server/database/avatar";
import {
  formatBytes,
  isErrorWithStatusCode,
  verifyAvatarOwnership,
} from "src/lib/shared/utils/utils";
import { Buffer } from "node:buffer";
import { CF_IMAGE_RESIZE_URL } from "$env/static/private";
import { ResourceNotFoundError } from "src/lib/shared/errors/missing-error";
import { ExternalErrorCodes } from "src/lib/shared/models/common";

export const load: PageServerLoad = async ({
  parent,
  locals: { safeGetSession },
}) => {
  const { session } = await safeGetSession();
  if (!session) throw redirect(303, "/sign-in");

  const {
    profile: { avatarUrl, firstName, lastName, bio },
  } = await parent();

  const updateNameForm = await superValidate({
    firstName,
    lastName
  }, zod(nameSchema));
  const updateBioForm = await superValidate({ bio: bio ?? "" }, zod(updateBioSchema), { errors: false });
  const updateEmailForm = await superValidate(
    { email: session.user.email },
    zod(emailSchema),
  );
  const deleteAccountForm = await superValidate(zod(deleteAccountSchema));
  const updatePasswordForm = await superValidate(zod(changePasswordSchema));
  const uploadAvatarForm = await superValidate(zod(avatarSchema));
  const deleteAvatarForm = await superValidate(
    { path: avatarUrl ?? "" },
    zod(deleteAvatarSchema),
  );
  return {
    updateNameForm,
    updateBioForm,
    updateEmailForm,
    deleteAccountForm,
    updatePasswordForm,
    uploadAvatarForm,
    deleteAvatarForm,
  };
};

export const actions = {
  bio: async (event) => {
    const {
      locals: { supabase, safeGetSession },
    } = event;
    const { user } = await safeGetSession();
    if (!user) throw redirect(303, "/sign-in");

    const form = await superValidate(event, zod(updateBioSchema));
    if (!form.valid) return fail(400, { form });
    const { bio } = form.data;

    const profileInput: ProfileInput = {
      id: user.id,
      bio,
    };

    try {
      await updateProfile(supabase, profileInput);
    } catch (error) {
      console.error(
        `Error on update profile in update bio with userid ${user.id}`,
        error,
      );
      return message(form, getFailFormMessage(), { status: 500 });
    }

    return { form };
  },
  name: async (event) => {
    const {
      locals: { supabase, safeGetSession },
    } = event;
    const { user } = await safeGetSession();
    if (!user) throw redirect(303, "/sign-in");

    const form = await superValidate(event, zod(nameSchema));
    if (!form.valid) return fail(400, { form });
    const { firstName, lastName } = form.data;

    const profileInput: ProfileInput = {
      id: user.id,
      first_name: firstName,
      last_name: lastName,
    };

    try {
      await updateProfile(supabase, profileInput);
    } catch (error) {
      console.error(
        `Error on update profile in update name with userid ${user.id}`,
        error,
      );
      return message(form, getFailFormMessage(), { status: 500 });
    }

    return { form };
  },
  email: async (event) => {
    const {
      locals: { supabase, safeGetSession },
    } = event;
    const { session } = await safeGetSession();
    if (!session) throw redirect(303, "/sign-in");

    const form = await superValidate(event, zod(emailSchema));
    if (!form.valid) return fail(400, { form });

    const { email } = form.data;
    try {
      await updateUserEmail(supabase, email);
    } catch (error) {
      console.error(
        `Error on update profile in update name with userid ${session?.user.id}`,
        error,
      );
      return message(form, getFailFormMessage(), { status: 500 });
    }

    return message(
      form,
      getSuccessFormMessage(
        "Bekräfta e-postadresserna",
        "Bekräfta ändringen på både gamla och nya e-postadresserna. Tills dess loggar du in med din nuvarande e-postadress.",
      ),
    );
  },
  avatar: async (event) => {
    const {
      locals: { supabase, safeGetSession },
    } = event;
    const { session, user } = await safeGetSession();
    if (!session) throw redirect(303, "/sign-in");

    const form = await superValidate(event, zod(avatarSchema));
    if (!form.data || !form.data.avatar) return fail(400, { form });
    if (form.data.avatar.type.endsWith("octet-stream"))
      return message(
        form,
        getFailFormMessage(
          "Filformatet är inte giltigt",
          `Filformatet är "octet-stream". Testa med en annan bild.`,
        ),
        { status: 400 },
      );
    if (!form.valid) return fail(400, { form });
    const { avatar } = form.data;

    let failedCompression = false;
    let input = await avatar.arrayBuffer();
    try {
      const res = await fetch(CF_IMAGE_RESIZE_URL, {
        method: "POST",
        body: input,
      });
      if (res.status !== 200)
        throw new Error(
          `Failed to resize image: ${res.status} ${res.statusText}`,
        );
      input = await res.arrayBuffer();
    } catch (error) {
      failedCompression = true;
      console.error("Error on compression:", error);
    }

    if (failedCompression)
      return message(
        form,
        getFailFormMessage(
          "Bilden är för stor",
          `Komprimeringen misslyckades. Din bild är ${formatBytes(Buffer.byteLength(input))}. Testa med en mindre bild.`,
        ),
        { status: 500 },
      );

    let avatarPath;
    try {
      const format = avatar.type.split("/")[1]; // example type property: image/png
      const fileName = `${user.id}---${crypto.randomUUID()}.${format}`;
      avatarPath = await uploadAvatar(supabase, fileName, input);
    } catch (error) {
      if (isErrorWithStatusCode(error)) {
        if (error.statusCode === ExternalErrorCodes.FileTooLargeStorageError)
          return message(
            form,
            getFailFormMessage(
              "Filen är för stor",
              `Din fil är ${formatBytes(Buffer.byteLength(input))}, maxgränsen är ${formatBytes(maxAvatarSize)}.`,
            ),
            { status: 413 },
          );
      }
      console.error("Unknown error on upload avatar", error);
      return message(form, getFailFormMessage(), { status: 500 });
    }

    try {
      await updateProfile(supabase, {
        id: user.id,
        avatar_url: avatarPath,
      });
    } catch (error) {
      console.error(
        `Error on update profile with new avatar on path ${avatarPath} with userid ${user.id}`,
        error,
      );
      return message(form, getFailFormMessage(), { status: 500 });
    }

    return withFiles({ form });
  },
  deleteAvatar: async (event) => {
    const {
      locals: { supabase, safeGetSession },
    } = event;
    const { session, user } = await safeGetSession();
    if (!session) throw redirect(303, "/sign-in");

    const form = await superValidate(event, zod(deleteAvatarSchema));
    if (!form.valid) return fail(400, { form });

    const { path } = form.data;

    if (!verifyAvatarOwnership(path, user.id)) {
      console.error(
        `User ${user.id} sent incorrect filename and might have tampered with form data. Filename is ${path}`,
      );
      return message(form, getFailFormMessage(), { status: 401 });
    }

    const dirs = path.split("/");
    const fileName = dirs[dirs.length - 1];
    try {
      await deleteAvatar(supabase, fileName);
    } catch (error) {
      if (error instanceof ResourceNotFoundError)
        console.error(
          "No object deleted. Possible permission or path issue",
          error,
        );
      else console.error("Unknown error on delete avatar from storage", error);

      return message(form, getFailFormMessage(), { status: 500 });
    }

    try {
      await updateProfile(supabase, {
        id: user.id,
        avatar_url: "",
      });
    } catch (error) {
      console.error(
        `Error on update profile with delete avatar for userid ${user.id}`,
        error,
      );
      return message(form, getFailFormMessage(), { status: 500 });
    }

    return { form };
  },
  deleteAccount: async (event) => {
    const {
      locals: { supabase, safeGetSession, supabaseServiceRole },
      cookies,
    } = event;
    const { user } = await safeGetSession();
    if (!user) throw redirect(303, "/sign-in");

    const form = await superValidate(event, zod(deleteAccountSchema));
    if (!form.valid) return fail(400, { form });
    const { password } = form.data;
    const { id, email } = user;
    if (!email) {
      console.error(
        `User with id ${id} has no email and therefore password could not be verified`,
      );
      return message(form, getFailFormMessage(), { status: 500 });
    }

    // Check current password is correct before deleting account
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw redirect(303, "/settings_password_error");
    // user was logged out because of bad password. Redirect to error page with explaination.

    try {
      const { error } = await supabaseServiceRole.auth.admin.deleteUser(
        id,
        false,
      );
      if (error) {
        console.error(
          `Error on attempt to delete user with userid ${id}`,
          error,
        );
        return message(form, getFailFormMessage(), { status: 500 });
      }

      await supabase.auth.signOut();
    } catch (e) {
      console.error(
        `Error on attempt to delete & signout user with userid ${id}`,
        e,
      );
      return message(form, getFailFormMessage(), { status: 500 });
    }

    throw redirect(
      303,
      `/`,
      { message: "Ditt konto har raderats.", type: "success" },
      cookies,
    );
  },
  password: async (event) => {
    const {
      locals: { supabase, safeGetSession },
    } = event;
    const { session } = await safeGetSession();
    if (!session) throw redirect(303, "/sign-in");

    const form = await superValidate(event, zod(changePasswordSchema));
    if (!form.valid) return fail(400, { form });

    const { new: newPassword, current } = form.data;

    const { id, email } = session.user;
    if (!email) {
      console.error(
        `User with id ${id} has no email and therefore password could not be verified`,
      );
      return message(form, getFailFormMessage(), { status: 500 });
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    });

    if (error) throw redirect(303, "/settings_password_error");
    // user was logged out because of bad password. Redirect to error page with explaination.

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      const isSameAsCurrent =
        isAuthApiError(updateError) &&
        updateError.status === 422 &&
        updateError.message.includes("different");
      if (isSameAsCurrent)
        return message(
          form,
          getFailFormMessage(
            "Ange ett nytt lösenord",
            "Det angivna lösenordet är samma som det nuvarande.",
          ),
          { status: 500 },
        );

      console.error(
        `Error on attempt to update password with userid ${id}`,
        updateError,
      );
      return message(form, getFailFormMessage(), { status: 500 });
    }
    return message(
      form,
      getSuccessFormMessage(
        "Lösenord ändrat",
        "Använd det nya lösenordet nästa gång du loggar in.",
      ),
    );
  },
};
