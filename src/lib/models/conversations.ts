import type { Tables } from "src/supabase";

export type Conversation = Omit<Tables<"conversations">, "teacher" | "student"> & {
    teacher: Tables<"profiles">;
    student: Tables<"profiles">;
};