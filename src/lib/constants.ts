import type { Message } from "./models/common";

export const websiteName = "Mindic";

export const unknownErrorMessage = "Något gick fel. Kontakta oss om detta fortsätter."

export const getGenericErrorMessage = (variant?: "success" | "warning" | "destructive", title?: string, description?: string): Message => (
  {
    variant: variant ?? "destructive",
    title: title ?? "Något gick fel",
    description: description ?? "Kontakta oss om detta fortsätter."
  })

export const initMessagesCount = 25;

export const defaultPlanId = "free";

export const pricingPlans = [
  {
    id: "free",
    name: "Gratis",
    price: 0,
    priceIntervalName: "per månad",
    stripe_price_id: null,
    features: ["1 kontaktförfrågning per månad"],
  },
  {
    id: "pro",
    name: "Pro",
    
    price: 49,
    priceIntervalName: "per månad",
    stripe_price_id: "price_1NkdZCHMjzZ8mGZnRSjUm4yA",
    stripe_product_id: "prod_OXj1CcemGMWOlU",
    features: [
      "Obegränsat med kontaktförfrågningar",
    ],
  },
  // {
  //   id: "enterprise",
  //   name: "Enterprise",
  //   description:
  //     "A plan to test the upgrade expereince. Try buying this with the test credit card 4242424242424242.",
  //   price: "$15",
  //   priceIntervalName: "per month",
  //   stripe_price_id: "price_1Nkda2HMjzZ8mGZn4sKvbDAV",
  //   stripe_product_id: "prod_OXj20YNpHYOXi7",
  //   features: [
  //     "Everything in Pro",
  //     "Try the 'upgrade plan' UX",
  //     "Still actually free!",
  //   ],
  // },
];
