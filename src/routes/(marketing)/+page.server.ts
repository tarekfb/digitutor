import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { searchSchema, } from "src/lib/shared/models/search";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(searchSchema))
    return { form };
}

export const actions: Actions = {
    search: async (event) => {
        const form = await superValidate(event, zod(searchSchema));
        if (!form.valid) return fail(400, { form });
        const { query } = form.data;
        const cleanedQuery = query.trim();
        redirect(302, `/search/?q=${cleanedQuery}`);
    }
}