// import { eq } from "drizzle-orm";
// import db from "$lib/server/database/drizzle";
// import { profileTable } from "$lib/server/database/schemas";
// import type { Session } from "@supabase/supabase-js";

// export const getProfileBySession = async (session: Session) => {
//   const id = session.user.id;

















//   return await getProfileByUserId(id);
// }

// export const getProfileByUserId = async (userId: string) => {
//   const profile = await db
//     .select()
//     .from(profileTable)
//     .where(eq(profileTable.userId, userId));
//   if (profile.length === 0)
//     return null;
//   else
//     return profile[0];
// }