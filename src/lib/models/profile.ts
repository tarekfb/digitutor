import type { Tables } from "src/supabase";
import { z } from "zod";
import { signUpUserFields } from "./user";

export type CompleteProfileInput = {
    firstName: string;
    lastName: string;
}

export const nameSchema = z.object({
    firstName: signUpUserFields.first_name,
    lastName: signUpUserFields.last_name,
});

export const emailSchema = z.object({
    email: signUpUserFields.email,
})

export type CreateProfile = {
    id: string;
    role: "teacher" | "student" | "admin";
    firstName: string;
    lastName: string;
}

export type Role = Pick<Tables<"profiles">, "role">["role"];