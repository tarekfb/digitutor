import type { SupabaseClient, User } from "@supabase/supabase-js";

import { PRIVATE_STRIPE_API_KEY } from "$env/static/private";
import Stripe from "stripe";
import { pricingPlans } from "../../constants/constants.ts";
import type { Database } from "src/supabase.ts";
import { getNow } from "../utils.ts";

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY);
// { apiVersion: "2023-08-16" }

export const getOrCreateCustomerId = async ({
  supabaseServiceRole,
  user,
}: {
  supabaseServiceRole: SupabaseClient<Database>;
  user: User;
}) => {
  const { data: dbCustomer, error } = await supabaseServiceRole
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  // PGRST116 == no rows
  if (error && error.code != "PGRST116") {
    console.error("error PGRST116 when getting customer id: no rows", error);
    return { error: error };
  }

  if (dbCustomer?.stripe_customer_id)
    return { customerId: dbCustomer.stripe_customer_id };

  // Fetch data needed to create customer
  const { data: profile, error: profileError } = await supabaseServiceRole
    .from("profiles")
    .select(`first_name`)
    .eq("id", user.id)
    .single();
  if (profileError) return { error: profileError };

  // Create a stripe customer
  let customer;
  try {
    customer = await stripe.customers.create({
      email: user.email,
      name: `${profile.first_name}`.trim() ?? "",
      metadata: {
        user_id: user.id,
      },
    });
  } catch (e) {
    console.error("Unknown error when creating stripe customer", e);
    return { error: e };
  }

  if (!customer.id) {
    console.error("Unknown error on stripe user creation");
    return { error: "Unknown stripe user creation error" };
  }

  // insert instead of upsert so we never over-write. PK ensures later attempts error.
  const { error: insertError } = await supabaseServiceRole
    .from("stripe_customers")
    .insert({
      user_id: user.id,
      stripe_customer_id: customer.id,
      updated_at: getNow(),
    });

  if (insertError) {
    console.error(
      "Unknown error on inserting row to stripe_customers",
      insertError,
    );
    return { error: insertError };
  }

  return { customerId: customer.id };
};

export const fetchSubscription = async ({
  customerId,
}: {
  customerId: string;
}) => {
  // Fetch user's subscriptions
  let stripeSubscriptions;
  try {
    stripeSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 100,
      status: "all",
    });
  } catch (e) {
    console.error(
      `unknown error when fetching list of subscriptions from stripe for customerid: ${customerId}`,
      e,
    );
    return { error: e };
  }

  // find "primary". The user may have several old ones, we want an active one (including trials, and past_due in grace period).
  const primaryStripeSubscription = stripeSubscriptions.data.find((x) => {
    return (
      x.status === "active" ||
      x.status === "trialing" ||
      x.status === "past_due"
    );
  });
  let appSubscription = null;
  if (primaryStripeSubscription) {
    const productId =
      primaryStripeSubscription?.items?.data?.[0]?.price.product ?? "";
    appSubscription = pricingPlans.find((pricingPlan) => {
      return pricingPlan.stripeProductId === productId;
    });
    if (!appSubscription)
      return {
        error:
          "Stripe subscription does not have matching app subscription in pricing_plans.ts (via product id match)",
      };
  }
  let primarySubscription = null;
  if (primaryStripeSubscription && appSubscription) {
    primarySubscription = {
      stripeSubscription: primaryStripeSubscription,
      appSubscription: appSubscription,
    };
  }

  const hasEverHadSubscription = stripeSubscriptions.data.length > 0;

  return {
    primarySubscription,
    hasEverHadSubscription,
  };
};
