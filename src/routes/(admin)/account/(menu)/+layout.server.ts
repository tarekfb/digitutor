import { searchSchema } from "src/lib/shared/models/search.ts";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { LayoutServerLoad } from "./$types.ts";
import { redirect } from "@sveltejs/kit";
import { getSubjects } from "src/lib/server/database/subjects.ts";
import { languages } from "src/lib/shared/models/common.ts";
import { type Subject, formatSubject } from "src/lib/shared/models/subject.ts";

export const load: LayoutServerLoad = async (event) => {
  const {
    locals: { safeGetSession, supabase },
  } = event;

  const { session } = await safeGetSession();
  if (!session) {
    redirect(303, "/sign-in");
  }

  const { profile } = await event.parent();

  let subjects: Subject[] = [];
  try {
    const rawSubjects = await getSubjects(supabase);
    subjects = rawSubjects.map((s) => formatSubject(s));
  } catch (e) {
    console.error("Unknown error when reading subjects", e);
    subjects = languages;
  }

  const searchForm = await superValidate(zod(searchSchema));
  return { profile, searchForm, subjects };
};
