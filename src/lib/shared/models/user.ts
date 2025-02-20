import type { TypeToZod } from "src/lib/shared/utils/utils.ts";
import { z } from "zod";
import { type Profile } from "./profile.ts";

export type SignUpUser = Pick<Profile, "role" | "firstName"> & {
  email: string;
  password: string;
  terms: boolean;
};

export const signUpUserFields: TypeToZod<SignUpUser> = {
  email: z.string().email("Ogiltig e-postadress."),
  password: z.string().min(5, "Måste vara minst 5 karaktärer."),
  role: z.enum(["student", "teacher", "admin"]),
  firstName: z
    .string()
    .min(1, "Får inte vara tomt.")
    .max(50, "Får inte vara mer än 50 karaktärer."),
  terms: z.boolean().refine((s) => s === true, "Villkoren är obligatoriska."),
};

export const signUpSchema = z.object(signUpUserFields);

export type SignInUser = {
  email: string;
  password: string;
};

const signInProperties = {
  email: z.string().email("Ogiltig e-postadress."),
  password: z.string().min(1, "Får inte vara tomt."),
};
export const signInSchema = z.object(signInProperties);

export const resendSchema = z.object({ email: signInProperties.email });

export const deleteAccountSchema = z.object({
  password: signInProperties.password,
});

// used for manually changing password in settings
export const changePasswordSchema = z
  .object({
    new: signUpUserFields.password,
    confirm: signUpUserFields.password,
    current: signInProperties.password,
  })
  .refine((data) => data.new === data.confirm, {
    message: "Lösenorden stämmer inte överens.",
    path: ["confirm"],
  });

// used for forgot password flow
export const requestPasswordResetSchema = z.object({
  email: signUpUserFields.email,
});

// used for forgot password flow
export const passwordResetSchema = z.object({
  newPassword: signUpUserFields.password,
});
