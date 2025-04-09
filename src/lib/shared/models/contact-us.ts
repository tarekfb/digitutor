import { z } from "zod";

export const maxMessageLength = 500;
export const contactUsSchema = z.object({
  email: z.string().email("Ogiltig e-postadress."),
  firstName: z
    .string()
    .min(1, "Får inte vara tomt.")
    .max(50, "Får inte vara mer än 50 karaktärer."),
  lastName: z
    .string()
    .min(1, "Får inte vara tomt.")
    .max(50, "Får inte vara mer än 50 karaktärer."),
  message: z
    .string()
    .min(5, "Måste vara minst 5 karaktärer.")
    .max(maxMessageLength, `Får inte vara mer än ${maxMessageLength} karaktärer.`),
});
