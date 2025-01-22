import type { Message } from "$lib/shared/models/common";
import { StripePriceId, PricingPlanIds, type PricingPlan, StripeProductId } from "../models/subscription";
import { isProd } from "$lib/shared/utils/utils";

export const websiteName = "Digitutor";
export const localBaseUrl = "http://localhost:5173";
export const testBaseUrl = `https://dev.mindic.pages.dev`;
export const prodBaseUrl = `https://mindic.pro`;

export const defaultErrorDescription =
  "Något gick fel. Du kan kontakta oss om detta fortsätter.";
export const defaultErrorTitle = "Något gick fel...";
export const defaultErrorInfo: App.Error = {
  message: defaultErrorTitle,
  description:
    "Ett oväntat fel uppstod. Du kan kontakta oss om detta fortsätter.",
};

export const getDefaultErrorInfo = (
  message?: string,
  description?: string,
  id?: MessageId,
  data?: any,
): App.Error => ({
  message: message ?? defaultErrorTitle,
  description: description ?? defaultErrorDescription,
  id: id ?? MessageId.Unknown,
  data: data ?? undefined,
});

export const getFailFormMessage = (
  title?: string,
  description?: string,
  messageId?: MessageId,
  data?: any,
  variant: "destructive" | "default" | "warning" = "destructive",
): Message => ({
  variant,
  title: title ?? "Något gick fel",
  description: description ?? "Du kan kontakta oss om detta fortsätter.",
  id: messageId ?? MessageId.Unknown,
  data: data ?? undefined,
});

export const getSuccessFormMessage = (
  title: string,
  description?: string,
  messageId?: MessageId,
  data?: any,
): Message => ({
  variant: "success",
  title,
  description: description ?? "",
  id: messageId ?? MessageId.Unknown,
  data: data ?? undefined,
});

export enum MessageId {
  Unknown = 0,
  RateLimitExceeded = 1,
  ResourceAlreadyExists = 2,
}

export const initMessagesCount = 25;

export const maxAvatarSize = 10485760;
// export const maxAvatarUncompressedSize = 512000;
export const acceptedAvatarFormats = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
];

export const getMimeType = (): string => {
  let formats = "";
  acceptedAvatarFormats.forEach((format) => (formats += `${format}, `));
  if (formats.length > 1) formats = formats.substring(0, formats.length - 2);
  return formats;
};

export const getFormatsHumanReadable = () => {
  let acceptedFormatsHumanReadable = "";
  acceptedAvatarFormats.forEach((format, i) => {
    const formatFormatted = format.split("/")[1];
    if (i === acceptedAvatarFormats.length - 1)
      acceptedFormatsHumanReadable += `och .${formatFormatted}.`;
    else acceptedFormatsHumanReadable += `.${formatFormatted}, `;
  });

  return acceptedFormatsHumanReadable;
};

export const defaultPlanId = PricingPlanIds.Free;

export const pricingPlans: PricingPlan[] = [
  {
    id: PricingPlanIds.Free,
    name: "Gratis",
    description: "En gratisplan. Inget betalkort behövs!",
    price: "0 SEK",
    priceIntervalName: "per månad",
    stripePriceId: StripePriceId.Free,
    features: ["Oändligt med förfrågningar", "Tillgång till alla lärare", "Max en konversation"],
  },
  {
    id: PricingPlanIds.Premium,
    name: "Premium",
    description:
      "En plan för dig som tar lärandet på allvar. Perfekt för att hitta den bästa läraren. Testa planen gratis med betalkortet: 4242424242424242.",
    price: "95 SEK",
    priceIntervalName: "per månad",
    stripePriceId: StripePriceId.PremiumTest,
    // stripePriceId: isProd ? StripePriceId.PremiumProd : StripePriceId.PremiumTest,  // todo: reactive when live
    stripeProductId: StripeProductId.PremiumTest,
    // stripeProductId:  isProd ? StripeProductId.PremiumProd : StripeProductId.PremiumTest, // todo: reactive when live
    features: [
      "Allt i gratisplanen",
      "Oändligt med konversationer",
    ],
  },
];
