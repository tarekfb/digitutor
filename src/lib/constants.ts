import type { Message } from "./models/common";

export const websiteName = "Mindic";

export const unknownErrorMessage = "Något gick fel. Kontakta oss om detta fortsätter."

export const getGenericErrorMessage = (variant?: "success" | "warning" | "destructive", title?: string, description?: string, messageId?: MessageId, data?: any): Message => (
  {
    variant: variant ?? "destructive",
    title: title ?? "Något gick fel",
    description: description ?? "Kontakta oss om detta fortsätter.",
    id: messageId ?? MessageId.Unknown,
    data: data ?? undefined
  })

export enum MessageId {
  Unknown = 0,
  RateLimitExceeded = 1,
}

export const initMessagesCount = 25;
