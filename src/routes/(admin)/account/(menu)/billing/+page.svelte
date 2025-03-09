<script lang="ts">
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import type { PageData } from "./$types.ts";
  import Container from "src/lib/components/templates/container.svelte";
  import { PricingPlanIds } from "src/lib/shared/models/subscription.ts";
  import {
    costPerRequest,
    premiumPlan,
    pricingPlans,
    websiteName,
    freeCredits,
  } from "src/lib/shared/constants/constants.ts";
  import Button from "src/lib/components/ui/button/button.svelte";
  import Pencil from "lucide-svelte/icons/pencil";
  import ExternalLink from "lucide-svelte/icons/square-arrow-out-up-right";
  import CreditsNav from "src/lib/components/molecules/credits-nav.svelte";
  import {
    creditProducts,
    defaultErrorDescription,
  } from "src/lib/shared/constants/constants.js";
  import AlertMessage from "src/lib/components/atoms/alert-message.svelte";
  import { goto } from "$app/navigation";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Separator } from "src/lib/components/ui/separator/index.ts";
  import Link from "src/lib/components/atoms/link.svelte";

  export let data: PageData;
  $: ({ balance, currentPlanId } = data);
  $: currentPlanName =
    pricingPlans.find((pricingPlan) => pricingPlan.id === currentPlanId)
      ?.name ?? "Okänd";
</script>

<svelte:head>
  <title>{websiteName} | Betalningar</title>
</svelte:head>

<Container maxWidth minWidth padding class="gap-y-6 self-center md:gap-y-8">
  <section class="flex flex-col items-center justify-center gap-y-2 md:gap-y-4">
    <PrimaryTitle responsiveMb>Betalningar</PrimaryTitle>
    <div class="self-start text-muted-foreground">
      <p>
        Här finns din betalningsinformation och betalningshistorik. Se <Link
          href="/pricing"
          target="_blank"
          class="text-muted-foreground">prissidan</Link
        >
        för mer information om premium och krediter.
      </p>
    </div>
    <Link
      href="/account/billing/manage"
      target="_blank"
      class="flex items-center gap-x-2"
      ><ExternalLink class="size-button-icon" />Se betalningshistorik</Link
    >
  </section>
  <section class="flex w-full flex-col items-center justify-center gap-y-4">
    <Card.Root class="w-full">
      <Card.Header
        class="flex flex-row items-center justify-between gap-x-2 gap-y-0"
      >
        <Card.Title class="text-xl md:text-2xl">Din nuvarande plan</Card.Title>
        <div
          class="self-start whitespace-nowrap rounded-sm border border-accent bg-card p-1 font-mono font-normal uppercase tracking-wider md:p-2 md:text-lg"
        >
          {currentPlanName}
        </div>
      </Card.Header>
      <Separator />
      <Card.Content class="flex flex-col gap-y-4 pt-5 text-muted-foreground ">
        <p>
          {#if currentPlanId === PricingPlanIds.Free}
            Denna plan är gratis och inget betalkort behövs. Du har automatiskt
            fått {freeCredits} krediter vid registrering. Du betalar {costPerRequest}
            krediter varje gång du kontaktar en lärare. Se hur många krediter du
            har kvar <Link
              class="text-muted-foreground"
              href="/account/billing#credits">nedan</Link
            >.
          {:else if currentPlanId === PricingPlanIds.Premium}
            Du har premium och kan kontakta obegränsat antal lärare.
          {/if}
        </p>
        <div
          class="flex flex-col gap-y-4 md:flex-row md:justify-end md:gap-x-4"
        >
          <Button
            href="/account/billing/manage"
            class="flex gap-x-2 text-foreground"
            variant="outline"><Pencil class="size-4" />Hantera</Button
          >
          {#if currentPlanId === PricingPlanIds.Free}
            <Button
              on:click={() =>
                goto(`/account/subscribe/${premiumPlan.stripePriceId}`)}
              class="icon-button wide-button flex gap-x-2 "
              variant="third"
            >
              <ExternalLink class="size-4" />Skaffa premium</Button
            >
          {/if}
        </div>
      </Card.Content>
    </Card.Root>

    {#if currentPlanId !== PricingPlanIds.Premium}
      <Card.Root class="w-full">
        <Card.Header
          class="flex flex-row items-center justify-between gap-x-2 gap-y-0"
        >
          <Card.Title id="credits" class="text-xl md:text-2xl"
            >Dina gratis kontaktförfrågningar</Card.Title
          >
          <div
            class="self-start whitespace-nowrap rounded-sm border border-accent bg-card p-1 font-mono font-normal uppercase tracking-wider md:p-2 md:text-lg"
          >
            {#if balance === undefined}
              ?
            {:else if balance < 0}
              0
            {:else}
              {balance}
            {/if}
            / {freeCredits}
          </div>
        </Card.Header>
        <Separator />
        <Card.Content
          class="flex flex-col gap-y-2 pt-5 text-muted-foreground md:gap-y-4"
        >
          {#if balance !== undefined}
            <p>
              {#if balance <= 0}
                <div class="flex flex-col gap-y-2">
                  <span>
                    Du verkar ha slut på gratis kontaktförfrågningar. Du kan
                    läsa mer om <Link href="/pricing">premium</Link>, eller
                    uppgradera medlemskapet direkt nedan.
                  </span>
                  <Button
                    on:click={() =>
                      goto(`/account/subscribe/${premiumPlan.stripePriceId}`)}
                    class="icon-button wide-button self-end"
                    variant="third"
                  >
                    <ExternalLink class="size-4" />Skaffa premium</Button
                  >
                </div>
              {:else}
                Du kan kontakta lärare {balance} gånger till, helt utan kostnad.
              {/if}
            </p>
          {/if}
          <ul
            class="flex flex-wrap justify-evenly gap-4 self-center md:w-full md:flex-row md:self-start"
          >
            {#each creditProducts as creditsProduct}
              <CreditsNav {creditsProduct} />
            {/each}
          </ul>
        </Card.Content>
      </Card.Root>
      {#if balance === undefined}
        <AlertMessage
          class="w-full self-center lg:w-3/4"
          title="Kunde inte hämta dina krediter"
          description={defaultErrorDescription}
          variant="destructive"
        />
      {/if}
    {/if}
  </section>
</Container>
