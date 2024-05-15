import type { Tables } from "src/supabase";

export type Role = Pick<Tables<"profiles">, "role">["role"];

// export type RegisterInput = Pick<Tables<"profile">, "profile" | "full_name"  > & {
//     profile?: Tables<"profiles">;
// };