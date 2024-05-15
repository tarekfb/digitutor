import type { Tables } from "src/supabase";
import type { TypeToZod } from "$lib/utils";
import { z } from "zod";

export type Listing = Omit<Tables<"listings">, "profile"> & {
    profile?: Tables<"profiles">;
};

export type InputListing = Pick<Tables<"listings">, 'hourlyPrice' | 'description' | 'subjects' | 'title' | 'visible'>;

const properties: TypeToZod<InputListing> = {
    description: z
        .string()
        .min(10, "Beskrivningen måste vara minst 10 karaktärer.")
        .max(160, "Beskrivningen måste vara maximalt 160 karaktärer.")
        .refine((s) => s.trim() !== "", "Beskrivningen får inte vara tom."),
    hourlyPrice: z
        .number()
        .min(0, "Timpriset får inte vara negativt.")
        .max(100000, "Självinsikt och självsäkerhet är en hårfin balansgång."),
    subjects: z.number().array().min(1, "Du måste välja minst ett ämne."),
    title: z
        .string()
        .min(3, "Rubriken måste vara minst 3 bokstäver.")
        .max(80, "Rubriken måste vara maximalt 100 bokstäver.")
        .refine((s) => s.trim() !== "", "Rubriken får inte vara tom."),
    visible: z
        .boolean()
    // currency: z
    // .string()
    // .length(3, "Valutan måste vara exakt 3 bokstäver.")
    // .refine((s) => s.trim() !== "", "Valutan får inte vara tom.")
    // .refine((s) => /^[A-Za-z]*$/.test(s), "Valutan får inte innehålla mellanslag."),
}

export const listingSchema = z.object(properties)