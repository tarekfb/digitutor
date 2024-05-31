<script lang="ts">
  import PricingModule from "./pricing_module.svelte";
  import { websiteName } from "$lib/constants";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import PricingCard from "src/lib/components/molecules/pricing-card.svelte";
  import { pricingPlans } from "$lib/constants";
</script>

<svelte:head>
  <title>Pricing</title>
  <meta name="description" content="Pricing details for {websiteName}" />
</svelte:head>

<div class="flex flex-col items-center gap-y-2 md:gap-y-4">
  <PrimaryTitle>Kostnad</PrimaryTitle>
  <SecondaryTitle class="text-muted-foreground"
    >Passa på när du kan</SecondaryTitle
  >
  <div class="flex flex-col items-center mt-6 md:mt-12 gap-y-4 md:gap-y-8">
    <PricingCard
      plan={pricingPlans[0]}
      callToAction="Kom igång"
      highlightedPlanId="pro"
    />
    <!-- todo: set flash on choose free -->
    <PricingCard
      plan={pricingPlans[1]}
      callToAction="Kom igång"
      highlightedPlanId="pro"
    />
  </div>
</div>
