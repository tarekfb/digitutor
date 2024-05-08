import type { Tables } from "src/supabase";
import type { TypeToZod } from "$lib/utils";
import { z } from "zod";

export type Listing = Omit<Tables<"listings">, "profile"> & {
    profile?: Tables<"profiles">;
};

type InputListing = Pick<Tables<"listings">, 'currency' | 'description' | 'subjects' | 'title'>;
const properties: TypeToZod<InputListing> = {
    description: z
        .string()
        .min(10, "Beskrivningen måste vara minst 10 karaktärer.")
        .max(160, "Beskrivningen måste vara maximalt 160 karaktärer.")
        .refine((s) => s.trim() !== "", "Beskrivningen får inte vara tom."),
    currency: z
        .string()
        .length(3, "Valutan måste vara exakt 3 bokstäver.")
        .refine((s) => s.trim() !== "", "Valutan får inte vara tom.")
        .refine((s) => /^[A-Za-z]*$/.test(s), "Valutan får inte innehålla mellanslag."),
    subjects: z.number().array().min(1),
    title: z
        .string()
        .min(3, "Rubriken måste vara minst 3 bokstäver.")
        .max(80, "Rubriken måste vara maximalt 100 bokstäver.")
        .refine((s) => s.trim() !== "", "Rubriken får inte vara tom."),
}

export const listingSchema = z.object(properties)