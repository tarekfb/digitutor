import type { Tables } from "src/supabase";
import { z } from "zod";
import { signUpUserFields } from "./user";

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

const MAX_FILE_SIZE = 49000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const avatarSchema = z.object({
    avatar: z
        .instanceof(File, { message: 'Ladda upp en fil.' })
        .refine((f) => f.size < MAX_FILE_SIZE, 'Max 49 MB filstorlek.')
        .refine(
            (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
            "Accepterade filformat är .jpg, .jpeg, .png och .webp."
        ),
});

// export const avatarSchema = z.object({
//     avatar: z
//         .any()
//         .refine((files) => files?.length == 1, "Ladda upp en bild.")
//         .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max 49 MB filstorlek.`)
//         .refine(
//             (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
//             "Accepterade filformat är .jpg, .jpeg, .png och .webp."
//         ),
// });