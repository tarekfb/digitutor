import type { Tables } from "src/supabase";
import type { TypeToZod } from "src/lib/shared/utils/utils";
import { z } from "zod";

export type Listing = Omit<Tables<"listings">, "profile"> & {
    profile: Tables<"profiles">;
};

export type InputListing = Pick<Tables<"listings">, 'description' | 'subjects' | 'title' | 'visible'> & {
    hourlyPrice: number
};

const updateListingProps: TypeToZod<InputListing> = {
    description: z
        .string()
        .min(10, "Måste vara minst 10 karaktärer.")
        .max(160, "Får inte vara mer än 160 karaktärer.")
        .refine((s) => s.trim() !== "", "Får inte vara tom."),
    hourlyPrice: z
        .coerce
        .number()
        .min(0, "Måste vara minst 0.")
        .max(100000, "Självinsikt och självsäkerhet är en hårfin balansgång."),
    subjects: z.number().array().min(1, "Du måste välja minst ett ämne."),
    title: z
        .string()
        .min(3, "Måste vara minst 3 bokstäver.")
        .max(80, "Måste vara maximalt 100 bokstäver.")
        .refine((s) => s.trim() !== "", "Får inte vara tom."),
    visible: z
        .boolean()
    // currency: z
    // .string()
    // .length(3, "Valutan måste vara exakt 3 bokstäver.")
    // .refine((s) => s.trim() !== "", "Valutan får inte vara tom.")
    // .refine((s) => /^[A-Za-z]*$/.test(s), "Valutan får inte innehålla mellanslag."),
}

export const updateListingSchema = z.object(updateListingProps)

export const initCreateListingSchema = z.object({ title: updateListingProps.title, nbrOfListings: z.number() })