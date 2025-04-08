import type { Message } from "$lib/shared/models/common.ts";
import {
  StripePriceId,
  PricingPlanIds,
  type PricingPlan,
  StripeProductId,
} from "../models/subscription.ts";

export const websiteName = "Digitutor";
export const contactEmail = "info@digitutor.se";
export const noReplyEmail = "noreply@digitutor.se";
export const localBaseUrl = "http://localhost:5173";
export const testBaseUrl = `https://dev.mindic.pages.dev`;
export const prodBaseUrl = `https://digitutor.se`;

export const getBaseUrl = (env: string): string => {
  if (env === "local") return localBaseUrl;
  if (env === "staging") return testBaseUrl;
  if (env === "prod") return prodBaseUrl;
  throw new Error("Unsupported environment")
}

export const defaultErrorDescription =
  "Något gick fel. Du kan kontakta oss om detta fortsätter.";
export const defaultErrorTitle = "Något gick fel...";
export const defaultErrorInfo: App.Error = {
  message: defaultErrorTitle,
  description:
    "Ett oväntat fel uppstod. Du kan kontakta oss om detta fortsätter.",
};

export const getDefaultErrorInfo = (
  options?: {
    message?: string,
    description?: string,
    trackingId?: string,
    id?: MessageId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
  }
): App.Error => ({
  message: options?.message ?? defaultErrorTitle,
  description: options?.description ?? defaultErrorInfo.description,
  id: options?.id ?? MessageId.Unknown,
  data: options?.data ?? undefined,
  trackingId: options?.trackingId ?? undefined,
});


export const getFailFormMessage = (
  options?: {
    title?: string,
    description?: string,
    messageId?: MessageId,
    trackingId?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    variant?: "destructive" | "default" | "warning",
  }
): Message => ({
  variant: options?.variant ?? "destructive",
  title: options?.title ?? "Något gick fel",
  description: options?.description ?? "Du kan kontakta oss om detta fortsätter.",
  trackingId: options?.trackingId ?? undefined,
  id: options?.messageId ?? MessageId.Unknown,
  data: options?.data ?? undefined,
});

export const getSuccessFormMessage = (
  title: string,
  description?: string,
  messageId?: MessageId,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  InsufficientCredits = 3,
  ContactUs = 4,
}

export const initMessagesCount = 25;

export const maxAvatarSize = 1048576;
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

export const costPerRequest = 1;
export const freeCredits = 5;
export const defaultPlanId = PricingPlanIds.Free;

export const freePlan: PricingPlan = {
  id: PricingPlanIds.Free,
  name: "Gratis",
  description: `Allt du behöver för att använda plattformen. Perfekt för de flesta användare. Du kan kontakta ${freeCredits} lärare helt gratis. Uppgradera när som helst.`,
  bold: `Inget betalkort behövs!`,
  price: "0 SEK",
  priceIntervalName: "per månad",
  stripePriceId: StripePriceId.Free,
  features: [
    `${freeCredits} gratis kontaktförfrågningar`,
    "Tillgång alla lärare",
  ],
};
export const premiumPlan: PricingPlan = {
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
  features: ["Allt i gratisplanen", "Oändligt med kontaktförfrågningar", "Avbryt prenumerationen när som helst"],
};

export const pricingPlans: PricingPlan[] = [freePlan, premiumPlan];
