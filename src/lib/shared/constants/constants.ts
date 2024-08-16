import type { Message } from "$lib/shared/models/common";

export const websiteName = "Mindic";

export const unknownErrorMessage = "Något gick fel. Kontakta oss om detta fortsätter."

export const getGenericFormMessage = (variant?: "success" | "warning" | "destructive" | "default", title?: string, description?: string, messageId?: MessageId, data?: any): Message => (
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

export const maxAvatarSize = 10485760;
export const maxAvatarUncompressedSize = 524288;
export const acceptedAvatarFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic"];

export const getMimeType = (): string => {
  let formats = "";
  acceptedAvatarFormats.forEach((format) => (formats += `${format}, `));
  if (formats.length > 1)
    formats = formats.substring(0, formats.length - 2);
  return formats;
}

export const getFormatsHumanReadable = () => {
  let acceptedFormatsHumanReadable = "";
  acceptedAvatarFormats.forEach((format, i) => {
    const formatFormatted = format.split("/")[1];
    if (i === acceptedAvatarFormats.length - 1)
      acceptedFormatsHumanReadable += `och .${formatFormatted}.`;
    else
      acceptedFormatsHumanReadable += `.${formatFormatted}, `;
  })

  return acceptedFormatsHumanReadable;
}