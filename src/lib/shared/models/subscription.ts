export type PricingPlan = {
  id: PricingPlanIds;
  name: string;
  description: string;
  bold?: string;
  price: string;
  priceIntervalName: string;
  stripePriceId: StripePriceId;
  stripeProductId?: string;
  features: string[];
};

export enum PricingPlanIds {
  Premium = "premium",
  Free = "free",
}

export enum StripePriceId {
  PremiumProd = "price_1QjMv1GCqJPEeIsYtN4gtKHs",
  PremiumTest = "price_1QjN6qGCqJPEeIsYblLub4Vu",
  Free = "free",
}


export enum StripeProductId {
  PremiumProd = "prod_Rcc9EqD9QDfjto",
  PremiumTest = "prod_RccLiXKOMY9hKL",
}
