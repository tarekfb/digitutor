import type { Tables } from "src/supabase";

export type Role = Pick<Tables<"profiles">, "role">["role"];