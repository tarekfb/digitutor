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
import { formatSearchResult } from "src/lib/shared/utils/listing/utils.ts";
import { getQueryFromFormData } from "src/lib/shared/utils/search/utils.ts";
import { PUBLIC_ENVIRONMENT } from "$env/static/public";

export const load = (async ({ url, locals: { supabase } }) => {
  const query = url.searchParams.get("q") || ""; // falsy query will get all
  const getAll = url.searchParams.get("getAll");
  const form = await superValidate(zod(searchSchema));

  let initMessage: Message | undefined;
  let initResults: SearchResult[] = [];

  if (!query && !getAll) return { form, initResults, initMessage };

  try {
    const dbLlistings = await search(supabase, query);
    initResults = dbLlistings.map((listing) => formatSearchResult(listing));
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
      locals: { supabase, captureException },
    } = event;

    const form = await superValidate(event, zod(searchSchema));
    if (!form.valid) return fail(400, { form });
    const query = getQueryFromFormData(form.data);

    try {
      const listings = await search(supabase, query);
      const formatted: SearchResult[] = listings.map((listing) => formatSearchResult(listing));
      throw new Error("PANIK - something wrong");
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

      const eventId = crypto.randomUUID();
      captureException({ error, event, message: "Error searching for teachers with following search: " + query, status: 500 });
      // const client = new PostHog(
      //   POSTHOG_API_KEY,
      //   { host: 'https://eu.i.posthog.com' }
      // )

      // client.capture({
      //   distinctId: "",
      //   event: "search error",
      //   properties: {
      //     environment: PUBLIC_ENVIRONMENT,
      //     ...(trackingId && { trackingId }),
      //   },
      // })


      console.log(captureException)
      // await client.shutdown()
      console.log("tried local capture")
      // await captureEvent("Error searching for teachers with following search: " + query, error, trackingId);
      // console.error(
      //   "Error searching for teachers with following search: " + query,
      //   error,
      // );
      return message(form, getFailFormMessage("trackingId: " + eventId), { status: 500 });
    }
  },
};
