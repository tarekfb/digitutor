export type SubscriptionPlan = {
  id: SubscriptionPlanIds;
  name: string;
  description: string;
  price: string;
  priceIntervalName: string;
  stripePriceId: string;
  stripeProductId?: string;
  features: string[];
};

export enum SubscriptionPlanIds {
  Premium = "premium",
  Free = "free",
}
