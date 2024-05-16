import type { Tables } from "src/supabase";
import type { TypeToZod } from "$lib/utils";
import { z } from "zod";

export type SignUpUser = Pick<Tables<"profiles">, "role" | "first_name" | "last_name"> & {
    email: string;
    password: string;
    terms: boolean;
};
const signUpUserFields: TypeToZod<SignUpUser> = {
    email: z
        .string()
        .min(3, "E-postaddressen måste vara minst 3 karaktärer."),
    password: z
        .string()
        .min(5, "Lösenordet måste vara minst 5 karaktärer."),
    role: z
        .enum(["student", "teacher", "admin"]),
    first_name: z
        .string()
        .min(1, "Förnamnet måste vara minst 1 bokstav.")
        .max(50, "Förnamnet får inte vara mer än 50 bokstäver."),
    last_name: z
        .string()
        .min(1, "Efternamnet måste vara minst 1 bokstav.")
        .max(50, "Efternamnet får inte vara mer än 50 bokstäver."),
    terms: z
        .boolean()
        .refine((s) => s === true, "Du måste godkanna villkoren.")

}
export const signUpSchema = z.object(signUpUserFields)


export type CreateProfile = {
    id: string;
    role: "teacher" | "student" | "admin";
    firstName: string;
    lastName: string;
}

export type Role = Pick<Tables<"profiles">, "role">["role"];

export type SignInUser = {
    email: string;
    password: string;
}
const signInProperties = {
    email: z
        .string()
        .min(1, "E-postaddressen får inte vara tom."),
    password: z
        .string()
        .min(1, "Lösenordet får inte vara tomt."),
}
export const signInSchema = z.object(signInProperties)

export type CompleteProfileInput = {
    firstName: string;
    lastName: string;
}

export const completeProfileProperties = {
    firstName: signUpUserFields.first_name,
    lastName: signUpUserFields.last_name,
}

export const completeProfileSchema = z.object(completeProfileProperties);

