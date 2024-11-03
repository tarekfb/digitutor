import { z } from "zod"

export const contactUsSchema = z.object({
    email: z.string().email("Ogiltig e-postadress."),
    firstName: z
        .string()
        .min(1, "Får inte vara tomt.")
        .max(50, "Får inte vara mer än 50 bokstäver."),
    lastName: z
        .string()
        .min(1, "Får inte vara tomt.")
        .max(50, "Får inte vara mer än 50 bokstäver."),
    message: z
        .string()
        .min(5, "Måste vara minst 5 karaktärer.")
        .max(500, "Får inte vara mer än 500 karaktärer."),
})