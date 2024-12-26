import type { Tables } from "src/supabase";
import { z } from "zod";
import { acceptedAvatarFormats, getFormatsHumanReadable, maxAvatarSize } from "../constants/constants";
import { formatBytes } from "src/lib/shared/utils/utils";

export type DbProfile = Tables<"profiles">

export type Profile = Omit<DbProfile, "created_at" | "updated_at" | "first_name" | "last_name" | "avatar_url"> & {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
}

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

// props for name schema and email schema should be selected from object signUpUserFields, but getting issues with undefined
// copy pasting instead [2024-12-26]
export const nameSchema = z.object({
    firstName: z
        .string()
        .min(1, "Får inte vara tomt.")
        .max(50, "Får inte vara mer än 50 bokstäver."),
    lastName: z
        .string()
        .min(1, "Får inte vara tomt.")
        .max(50, "Får inte vara mer än 50 bokstäver."),
});

export const emailSchema = z.object({
    email: z.string().email("Ogiltig e-postadress."),
})

// export const nameSchema = z.object({
//     firstName: signUpUserFields.firstName,
//     lastName: signUpUserFields.lastName,
// });

// export const emailSchema = z.object({
//     email: signUpUserFields.email,
// })

export type CreateProfile = {
    id: string;
    role: "teacher" | "student" | "admin";
    firstName: string;
    lastName: string;
}

export type Role = DbProfile["role"];

export const avatarSchema = z.object({
    avatar: z
        .instanceof(File, { message: 'Ladda upp en fil.' })
        .refine((f) => f.size < maxAvatarSize, `Max ${formatBytes(maxAvatarSize)} filstorlek.`)
        .refine(
            (f) => acceptedAvatarFormats.includes(f.type),
            `Accepterade filformat är ${getFormatsHumanReadable()}`
        ),
});


export const deleteAvatarSchema = z.object({
    path: z.string(),
});