import type { Message } from "./models/common";

export const websiteName = "Mindic";

export const unknownErrorMessage = "Något gick fel. Kontakta oss om detta fortsätter."

export const getGenericErrorMessage = (variant?: "success" | "warning" | "destructive", title?: string, description?: string): Message => (
    {
        variant: variant ?? "destructive",
        title: title ?? "Något gick fel",
        description: description ?? "Kontakta oss om detta fortsätter."
    })

export const initMessagesCount = 25