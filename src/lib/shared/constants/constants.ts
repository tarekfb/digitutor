import type { Message } from "$lib/shared/models/common";

export const websiteName = "Mindic";

export const unknownErrorMessage = "Något gick fel. Kontakta oss om detta fortsätter."

export const getGenericFormMessage = (variant?: "success" | "warning" | "destructive", title?: string, description?: string, messageId?: MessageId, data?: any): Message => (
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

export const maxAvatarSize = 2097152; // not used?
export const maxAvatarUncompressedSize = 1048576;
export const maxAvatarSizeSelection = 51380224;
export const acceptedAvatarFormats = ["image/jpeg", "image/png", "image/webp"]; // todo update with jimp