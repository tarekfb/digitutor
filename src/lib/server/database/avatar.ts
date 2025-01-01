import { PUBLIC_SUPABASE_STORAGE_URL } from "$env/static/public";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "lucide-svelte";
import { ResourceNotFoundError } from "src/lib/shared/errors/missing-error";

export type FileBody =
  | ArrayBuffer
  | ArrayBufferView
  | Blob
  | Buffer
  | File
  | FormData
  | NodeJS.ReadableStream
  | ReadableStream<Uint8Array>
  | URLSearchParams
  | string;

export const uploadAvatar = async (
  supabase: SupabaseClient<Database>,
  fileName: string,
  fileBody: FileBody,
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(fileName, fileBody, {
      cacheControl: "15768000", // 6 months
      upsert: true,
    });

  if (error) {
    console.error("Failed to upload avatar: ", { error });
    throw error;
  }

  return `${PUBLIC_SUPABASE_STORAGE_URL}/avatars/${data.path}`;
};

export const deleteAvatar = async (
  supabase: SupabaseClient<Database>,
  fileName: string,
): Promise<void> => {
  const { data, error } = await supabase.storage
    .from("avatars")
    .remove([fileName]);

  if (error) {
    console.error("Failed to delete avatar: ", { error });
    throw error;
  }

  if (data.length === 0) {
    throw new ResourceNotFoundError(404);
  }
};
