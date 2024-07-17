import type { Tables } from "src/supabase";
import { z } from "zod";
import { signUpUserFields } from "./user";
import { acceptedFileFormats, maxFileSizeSelection } from "../constants/constants";

export type FinishProfileInput = {
    firstName: string;
    lastName: string;
}

export type ProfileInput = {
    id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    is_active?: boolean;
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

export const avatarSchema = z.object({
    avatar: z
        .instanceof(File, { message: 'Ladda upp en fil.' })
        .refine((f) => f.size < maxFileSizeSelection, 'Max 49 MB filstorlek.')
        .refine(
            (f) => acceptedFileFormats.includes(f.type),
            "Accepterade filformat är .jpeg, .png och .webp."
        ),
});