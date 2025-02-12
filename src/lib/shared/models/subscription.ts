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

export type CreditsProduct = {
  price: string;
  credits: number;
  stripePriceId: StripePriceId;
  stripeProductId: StripeProductId;
};

export enum PricingPlanIds {
  Premium = "premium",
  Free = "free",
}

export enum StripePriceId {
  PremiumProd = "price_1QjMv1GCqJPEeIsYtN4gtKHs",
  PremiumTest = "price_1QjN6qGCqJPEeIsYblLub4Vu",
  Free = "free",
  SmallCreditsProd = "price_1QkUF9GCqJPEeIsYMQJRDYu6",
  SmallCreditsTest = "price_1QkUR9GCqJPEeIsY7aelYiev",
  LargeCreditsProd = "price_1QkUJJGCqJPEeIsYjfIM3o45",
  LargeCreditsTest = "price_1QkUQMGCqJPEeIsYaLI9gvtS",
}

export enum StripeProductId {
  PremiumProd = "prod_Rcc9EqD9QDfjto",
  PremiumTest = "prod_RccLiXKOMY9hKL",
  SmallCreditsProd = "prod_RdlmDQ8WdDsvPy",
  SmallCreditsTest = "prod_RdlzHh9ic8qEt0",
  LargeCreditsProd = "prod_RdlrftwiUwEKRc",
  LargeCreditsTest = "prod_RdlyxperhcWHYD",
}
