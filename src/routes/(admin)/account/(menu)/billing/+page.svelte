<script lang="ts">
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import type { PageData } from "./$types.ts";
  import Container from "src/lib/components/templates/container.svelte";
  import { PricingPlanIds } from "src/lib/shared/models/subscription.ts";
  import {
    premiumPlan,
    pricingPlans,
    websiteName,
    freeCredits,
  } from "src/lib/shared/constants/constants.ts";
  import Button from "src/lib/components/ui/button/button.svelte";
  import Pencil from "lucide-svelte/icons/pencil";
  import ExternalLink from "lucide-svelte/icons/square-arrow-out-up-right";
  import { goto } from "$app/navigation";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Separator } from "src/lib/components/ui/separator/index.ts";
  import Link from "src/lib/components/atoms/link.svelte";
  import { getDisplayCredits } from "src/lib/shared/utils/credits/utils.ts";

  export let data: PageData;
  $: ({ credits, currentPlanId } = data);

  $: displayCredits = getDisplayCredits(credits ?? 0, freeCredits);
</script>

<svelte:head>
  <title>{websiteName} | Betalningar</title>
</svelte:head>

<Container maxWidth minWidth padding class="gap-y-6 self-center md:gap-y-8">
  <section class="flex flex-col items-center justify-center gap-y-2 md:gap-y-4">
    <PrimaryTitle responsiveMb>Betalningar</PrimaryTitle>
    <div class="self-start text-muted-foreground">
      <p>
        Här finns din betalningsinformation. Se <Link href="/pricing"
          >premium</Link
        >
        för mer information om prenumarationer och gratis kontaktförfrågningar.
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
        <Card.Title class="text-xl md:text-2xl">Nuvarande plan</Card.Title>
        <div
          class="self-start whitespace-nowrap rounded-sm border border-accent bg-card p-1 font-mono font-normal uppercase tracking-wider md:p-2 md:text-lg"
        >
          {pricingPlans.find((pricingPlan) => pricingPlan.id === currentPlanId)
            ?.name ?? "Okänd"}
        </div>
      </Card.Header>
      <Separator />
      <Card.Content class="flex flex-col gap-y-4 pt-5">
        <p class="text-muted-foreground">
          {#if currentPlanId === PricingPlanIds.Free}
            Denna plan är gratis och inget betalkort behövs. Du har automatiskt
            fått {freeCredits} gratis kontaktförfrågningar när du registrerade dig.
            Se hur många förfrågningar du har kvar <Link
              class="text-muted-foreground"
              href="/account/billing#credits">nedan</Link
            >.
          {:else if currentPlanId === PricingPlanIds.Premium}
            Du har premium och kan kontakta obegränsat antal lärare.
          {:else}
            Något gick fel när vi hämtade din plan. Du kan försöka igen senare,
            eller <Link href="/contact-us">kontakta oss</Link> om problemet kvarstår.
          {/if}
        </p>
        <div
          class="flex flex-col gap-y-4 md:flex-row md:justify-end md:gap-x-4"
        >
          <Button
            href="/account/billing/manage"
            class="flex gap-x-2"
            variant="outline"><Pencil class="size-4" />Betalningar</Button
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
            >Återstående kontaktförfrågningar</Card.Title
          >
          <div
            class="self-start whitespace-nowrap rounded-sm border border-accent bg-card p-1 font-mono font-normal uppercase tracking-wider md:p-2 md:text-lg"
          >
            {#if credits === undefined}
              ?
            {:else}
              {displayCredits}
            {/if}
            / {freeCredits}
          </div>
        </Card.Header>
        <Separator />
        <Card.Content
          class="flex flex-col gap-y-2 pt-5 text-muted-foreground md:gap-y-4"
        >
          <p class="text-muted-foreground">
            {#if credits === undefined}
              Något gick fel när vi hämtade dina gratis kontaktförfrågningar. Du
              kan försöka igen senare, eller <Link href="/contact-us"
                >kontakta oss</Link
              > om problemet kvarstår.
            {:else if displayCredits === 0}
              <div class="flex flex-col gap-y-2">
                <span>
                  Du verkar ha slut på gratis kontaktförfrågningar. Du kan läsa
                  mer om <Link href="/pricing">premium</Link>, eller uppgradera
                  medlemskapet direkt nedan.
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
              Du kan kontakta lärare {displayCredits} gånger till, helt utan kostnad.
            {/if}
          </p>
        </Card.Content>
      </Card.Root>
    {/if}
  </section>
</Container>
