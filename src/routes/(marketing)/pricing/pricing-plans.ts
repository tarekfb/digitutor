export const defaultPlanId = "free";

export const pricingPlans = [
  {
    id: "free",
    name: "Gratis",
    description: "En kostnadsfri plan för att kickstarta ditt lärande!",
    price: "0 SEK",
    priceIntervalName: "per månad",
    stripe_price_id: null,
    features: ["1 kontaktförfrågning per månad"],
  },
  {
    id: "pro",
    name: "Pro",
    description:
      "En plan som täcker alla dina behov",
    price: "49 SEK",
    priceIntervalName: "per månad",
    stripe_price_id: "price_1NkdZCHMjzZ8mGZnRSjUm4yA",
    stripe_product_id: "prod_OXj1CcemGMWOlU",
    features: [
      "Obegränsat med kontaktförfrågningar",
      "Inget betalkort krävs",
      "Inga överraskningar eller avgifter",
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
