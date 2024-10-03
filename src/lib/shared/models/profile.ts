import type { Tables } from "src/supabase";
import { z } from "zod";
import { signUpUserFields } from "./user";
import { acceptedAvatarFormats, getFormatsHumanReadable, maxAvatarSize } from "../constants/constants";
import { formatBytes } from "src/lib/utils";

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
    role: "teacher" | "student";
    firstName: string;
    lastName: string;
}

export type Role = Pick<Tables<"profiles">, "role">["role"];

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