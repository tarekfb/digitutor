import type { Tables } from "src/supabase";
import type { TypeToZod } from "$lib/utils";
import { z } from "zod";

export type Role = Pick<Tables<"profiles">, "role">["role"];

export type InputUser = Pick<Tables<"profiles">, "role" | "first_name" | "last_name"> & {
    email: string;
    password: string;
    terms: boolean;
};

const properties: TypeToZod<InputUser> = {
    email: z
        .string()
        .min(3, "E-postaddressen måste vara minst 3 bokstäver."),
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

export const signupSchema = z.object(properties)


export type CreateProfileInput = {
    userId: string;
    role: "teacher" | "student" | "admin";
    firstName: string;
    lastName: string;
}