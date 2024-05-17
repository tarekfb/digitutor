import type { Message } from "./models/common";

export const websiteName = "Mindic";

export const unknownErrorMessage = "Något gick fel. Kontakta oss om detta fortsätter."

export const genericErrorMessage: Message = {
    variant: "destructive",
    title: "Något gick fel",
    description: "Kontakta oss om detta fortsätter."
}
