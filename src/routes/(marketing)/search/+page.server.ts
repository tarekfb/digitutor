import { search } from "src/lib/server/database/search.ts";
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
import { isErrorWithCode } from "src/lib/shared/utils/utils.ts";
import { getSubjects } from "src/lib/server/database/subjects.ts";
import { formatSubject, type Subject } from "src/lib/shared/models/subject.ts";
import { formatSearchResult } from "src/lib/shared/utils/search/utils.ts";
import { getQueryFromFormData } from "src/lib/shared/utils/search/utils.ts";
import { logErrorServer } from "src/lib/shared/utils/logging/utils.ts";

export const load = (async ({ url, locals: { supabase } }) => {
  const query = url.searchParams.get("q") || ""; // falsy query will get all
  const getAll = url.searchParams.get("getAll");
  const form = await superValidate(zod(searchSchema));

  let initMessage: Message | undefined;
  let initResults: SearchResult[] = [];

  if (!query && !getAll) return { form, initResults, initMessage };

  try {
    const dbListings = await search(supabase, query);
    initResults = dbListings.map(dbListing => formatSearchResult(dbListing));
  } catch (error) {
    if (isErrorWithCode(error)) {
      if (error.code == ExternalErrorCodes.SyntaxError)
        initMessage = getFailFormMessage({ title: "Ogiltiga karaktärer", description: "Testa söka på något annat.", });
      else
        initMessage = getFailFormMessage({
          title: "Något gick fel",
          description: "Testa söka på något annat, eller försök igen senare.",
        });
    } else {
      logErrorServer({
        error,
        message: `Error searching for teachers with following search: ${query}`,
      });
      initMessage = getFailFormMessage();
    }
  }

  let subjects: Subject[] = [];
  try {
    const rawSubjects = await getSubjects(supabase);
    subjects = rawSubjects.map((s) => formatSubject(s));
  } catch (e) {
    logErrorServer({ error: e, message: "Unknown error when reading subjects" });
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
    const query = getQueryFromFormData(form.data);

    try {
      const listings = await search(supabase, query);
      const formatted = listings.map(listing => formatSearchResult(listing));
      return { form, formatted };
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (error.code === ExternalErrorCodes.SyntaxError)
          return message(
            form,
            getFailFormMessage({
              title: "Ogiltiga karaktärer",
              description: "Testa söka på något annat.",
            }),
            { status: 400 },
          );
      }
      const trackingId = logErrorServer({
        error,
        message: "Error searching for teachers with following search: " + query,
      });
      return message(form, getFailFormMessage({ trackingId }), { status: 500 });
    }
  },
};
