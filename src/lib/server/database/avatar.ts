import { PUBLIC_SUPABASE_STORAGE_URL } from "$env/static/public";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "lucide-svelte";

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
    | string

export const uploadAvatar = async (
    supabase: SupabaseClient<Database>,
    fileName: string,
    fileBody: FileBody,
): Promise<string> => {
    const { data, error } = await supabase
        .storage
        .from('avatars')
        .upload(fileName, fileBody, {
            cacheControl: '15768000', // 6 months
            upsert: true
        })

    if (error) {
        console.error("Failed to upload avatar: ", { error });
        throw error;
    }

    return `${PUBLIC_SUPABASE_STORAGE_URL}/avatars/${data.path}`
};