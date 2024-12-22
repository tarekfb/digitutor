import { z } from "zod";

export type DbSubject = {
    id: number;
    title: string;
    alt_title: string | null | undefined;
}

export type Subject = {
    id: number;
    title: string;
    altTitle?: string;
}

export const formatSubject = (dbSubject: DbSubject): Subject => ({
    id: dbSubject.id,
    title: dbSubject.title,
    altTitle: dbSubject.alt_title || undefined,
});

export const suggestSubjectSchema = z.object({
    subject: z
        .string()
        .min(1, "Måste vara minst 1 karaktär.")
        .max(50, "För många karaktärer."),
    email: z.string().email("Ogiltig e-postadress.").optional(),
    isRetry: z.boolean().default(false).optional(),
})