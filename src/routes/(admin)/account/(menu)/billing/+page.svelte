<script lang="ts">
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import type { PageData } from "./$types";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import { websiteName } from "src/lib/shared/constants/constants";

  export let data: PageData;

</script>

<svelte:head>
  <title>{websiteName} | Betalning</title>
</svelte:head>

<RootContainer responsiveGap maxWidth minWidth class="self-center">
  <div class="flex flex-col items-center justify-center gap-y-0.5">
    <PrimaryTitle class="mb-2">Betalning</PrimaryTitle>
    <p class="text-lg text-muted-foreground md:text-xl">
      Här finns din betalningsinformation och betalningshistorik.
    </p>
  </div>

  <p>tomt</p>
</RootContainer>

<!-- <script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import SettingsModule from "../settings/settings_module.svelte";
  import PricingModule from "src/routes/(marketing)/pricing/pricing_module.svelte";
  import {
    pricingPlans,
    defaultPlanId,
  } from "../../../../(marketing)/pricing/pricing_plans";
  let adminSection: Writable<string> = getContext("adminSection");
  adminSection.set("billing");
  export let data;
  let currentPlanId = data.currentPlanId ?? defaultPlanId;
  let currentPlanName = pricingPlans.find(
    (x) => x.id === data.currentPlanId,
  )?.name;
</script> -->
<!-- 
<svelte:head>
  <title>Billing</title>
</svelte:head> -->
<!-- 
<h1 class="text-2xl font-bold mb-6">
  {data.isActiveCustomer ? "Billing" : "Select a Plan"}
</h1>

{#if !data.isActiveCustomer}
  <div class="mt-12">
    <PricingModule {currentPlanId} callToAction="Select Plan" center={false} />
  </div>

  {#if data.hasEverHadSubscription}
    <div class="mt-10">
      <a href="/account/billing/manage" class="link">View past invoices</a>
    </div>
  {/if}
{:else}
  <SettingsModule
    title="Subscription"
    editable={false}
    fields={[
      {
        id: "plan",
        label: "Current Plan",
        initialValue: currentPlanName || "",
      },
    ]}
    editButtonTitle="Manage Subscripton"
    editLink="/account/billing/manage"
  />
{/if} -->
