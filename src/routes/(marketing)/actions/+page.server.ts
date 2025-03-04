import { type Actions, redirect } from "@sveltejs/kit";
import { fail } from "assert";
import { searchSchema } from "src/lib/shared/models/search.ts";
import { getQueryFromFormData } from "src/lib/shared/utils/search/utils.ts";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const actions: Actions = {
  search: async (event) => {
    const form = await superValidate(event, zod(searchSchema));
    if (!form.valid) return fail(400, { form });

    const query = getQueryFromFormData(form.data, true);
    redirect(302, query ? `/search/?q=${query}` : `/search?getAll=true`);
  },
};
