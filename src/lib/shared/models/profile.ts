import type { Tables } from "src/supabase.ts";
import { z } from "zod";
import {
  acceptedAvatarFormats,
  getFormatsHumanReadable,
  maxAvatarSize,
} from "../constants/constants.ts";
import { formatBytes } from "src/lib/shared/utils/utils.ts";

export type DbProfile = Tables<"profiles">;

export type Profile = Omit<
  DbProfile,
  "created_at" | "updated_at" | "first_name" | "avatar_url"
> & {
  firstName: string;
  avatarUrl?: string;
};

export type FinishProfileInput = {
  firstName: string;
};

export type ProfileInput = {
  id: string;
  first_name?: string;
  bio?: string;
  avatar_url?: string;
  is_active?: boolean;
};

// props for name schema and email schema should be selected from object signUpUserFields, but getting issues with undefined
// copy pasting instead [2024-12-26]
export const nameSchema = z.object({
  firstName: z
    .string()
    .min(1, "Får inte vara tomt.")
    .max(50, "Får inte vara mer än 50 karaktärer."),
});

export const emailSchema = z.object({
  email: z.string().email("Ogiltig e-postadress."),
});

// export const nameSchema = z.object({
//     firstName: signUpUserFields.firstName,
// });

// export const emailSchema = z.object({
//     email: signUpUserFields.email,
// })

export type CreateProfile = {
  id: string;
  role: "teacher" | "student" | "admin";
  firstName: string;
};

export type Role = DbProfile["role"];

export const isValidFileSize = (f: File): boolean => f.size < maxAvatarSize;
export const invalidFileSizeMessage = `Max ${formatBytes(maxAvatarSize)} filstorlek.`;

export const avatarSchema = z.object({
  avatar: z
    .instanceof(File, { message: "Ladda upp en fil." })
    .refine(
      (f) => isValidFileSize(f),
      invalidFileSizeMessage,
    )
    .refine(
      (f) => acceptedAvatarFormats.includes(f.type),
      `Accepterade filformat är ${getFormatsHumanReadable()}`,
    ),
});

export const deleteAvatarSchema = z.object({
  path: z.string(),
});

export const updateBioSchema = z.object({
  bio: z
    .string()
    .min(10, "Måste vara minst 10 karaktärer.")
    .max(2000, "Får inte vara mer än 2000 karaktärer."),
});
