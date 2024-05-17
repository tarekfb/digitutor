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
        .min(3, "Måste vara minst 3 karaktärer."),
    password: z
        .string()
        .min(5, "Måste vara minst 5 karaktärer."),
    role: z
        .enum(["student", "teacher", "admin"]),
    first_name: z
        .string()
        .min(1, "Måste vara minst 1 bokstav.")
        .max(50, "Får inte vara mer än 50 bokstäver."),
    last_name: z
        .string()
        .min(1, "Måste vara minst 1 bokstav.")
        .max(50, "Får inte vara mer än 50 bokstäver."),
    terms: z
        .boolean()
        .refine((s) => s === true, "Villkoren är obligatoriska.")

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
        .min(1, "Får inte vara tom."),
    password: z
        .string()
        .min(1, "Får inte vara tomt."),
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

