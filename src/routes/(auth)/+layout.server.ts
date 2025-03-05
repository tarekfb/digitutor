import { redirect } from "sveltekit-flash-message/server";
import type { LayoutServerLoad } from "./$types.ts";
import { searchSchema } from "src/lib/shared/models/search.ts";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { getSubjects } from "src/lib/server/database/subjects.ts";
import { languages } from "src/lib/shared/models/common.ts";
import { type Subject, formatSubject } from "src/lib/shared/models/subject.ts";

export const ssr = true;

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabase },
  cookies,
  url,
}) => {
  // depends("supabase:auth");
  const { session } = await safeGetSession();

  if (
    session &&
    url.pathname.includes("/sign-up") &&
    url.searchParams.get("role") === "teacher"
  ) {
    redirect(
      303,
      `/account`,
      {
        message: `Du är redan inloggad. Om du vill skapa konto som lärare, logga ut först.`,
        type: "info",
      },
      cookies,
    );
  }
  if (session) {
    redirect(
      303,
      "/account",
      {
        message: `Du är redan inloggad.`,
        type: "info",
      },
      cookies,
    );
  }


  let subjects: Subject[] = [];
  try {
    const rawSubjects = await getSubjects(supabase);
    subjects = rawSubjects.map((s) => formatSubject(s));
  } catch (e) {
    console.error("Unknown error when reading subjects", e);
    subjects = languages;
  }

  const searchForm = await superValidate(zod(searchSchema));
  return { searchForm, subjects}
};
