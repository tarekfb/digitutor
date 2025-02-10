import { search } from "src/lib/server/database/search";
import { getFailFormMessage } from "src/lib/shared/constants/constants.ts";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
  searchSchema,
  type SearchResult,
} from "src/lib/shared/models/search.ts";
import type { Actions, PageServerLoad } from "./$types.ts";
import {
  type Message,
  ExternalErrorCodes,
  languages,
} from "src/lib/shared/models/common.ts";
import { cleanQuery, isErrorWithCode } from "src/lib/shared/utils/utils.ts";
import { formatProfile } from "src/lib/shared/utils/profile/utils.ts";
import { getSubjects } from "src/lib/server/database/subjects.ts";
import { formatSubject, type Subject } from "src/lib/shared/models/subject.ts";

export const load = (async ({ url, locals: { supabase } }) => {
  const query = url.searchParams.get("q") || "";
  const form = await superValidate(zod(searchSchema));

  let initMessage: Message | undefined;
  let initResults: SearchResult[] = [];

  if (!query) return { form, initResults, initMessage };

  try {
    const dbLlistings = await search(supabase, query);
    initResults = dbLlistings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description ?? undefined,
      hourlyPrice: listing.hourly_price,
      firstName: listing.profile.first_name,
      lastName: listing.profile.last_name,
      avatar: listing.profile.avatar_url ?? undefined,
      subjects: listing.subjects,
      profile: formatProfile(listing.profile),
    }));
  } catch (error) {
    if (isErrorWithCode(error)) {
      if (error.code == ExternalErrorCodes.SyntaxError)
        initMessage = getFailFormMessage(
          "Ogiltiga karaktärer",
          "Testa söka på något annat.",
        );
      else
        initMessage = getFailFormMessage(
          "Något gick fel",
          "Testa söka på något annat, eller försök igen senare.",
        );
    } else {
      console.error(
        "Error searching for teachers with following search: " + query,
        error,
      );
      initMessage = getFailFormMessage();
    }
  }

  let subjects: Subject[] = [];
  try {
    const rawSubjects = await getSubjects(supabase);
    subjects = rawSubjects.map((s) => formatSubject(s));
  } catch (e) {
    console.error("Unknown error when reading subjects", e);
    subjects = languages;
  }
  return { subjects, form, initResults, initMessage };
}) satisfies PageServerLoad;

export const actions: Actions = {
  search: async (event) => {
    const {
      locals: { supabase },
    } = event;

    const form = await superValidate(event, zod(searchSchema));
    if (!form.valid) return fail(400, { form });
    const { query, subjects } = form.data;

    if (!query && (!subjects || subjects === "undefined"))
      return fail(400, { form });

    const cleanedQuery = cleanQuery(query ?? "", subjects);
    if (!cleanedQuery) return fail(400, { form });

    try {
      const listings = await search(supabase, cleanedQuery);
      const formatted: SearchResult[] = listings.map((listing) => {
        return {
          id: listing.id,
          title: listing.title,
          description: listing.description ?? undefined,
          hourlyPrice: listing.hourly_price,
          firstName: listing.profile.first_name,
          lastName: listing.profile.last_name,
          avatar: listing.profile.avatar_url ?? undefined,
          subjects: listing.subjects,
          profile: formatProfile(listing.profile),
        };
      });

      return { form, formatted };
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (error.code === ExternalErrorCodes.SyntaxError)
          return message(
            form,
            getFailFormMessage(
              "Ogiltiga karaktärer",
              "Testa söka på något annat.",
            ),
            { status: 400 },
          );
      }
      console.error(
        "Error searching for teachers with following search: " + query,
        error,
      );
      return message(form, getFailFormMessage(), { status: 500 });
    }
  },
};
