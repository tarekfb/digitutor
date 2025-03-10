<script lang="ts">
  import {
    freeCredits,
    premiumPlan,
    websiteName,
  } from "src/lib/shared/constants/constants.ts";
  import * as Accordion from "src/lib/components/ui/accordion/index.js";
  import { cn } from "src/lib/shared/utils/utils.js";
  import Link from "src/lib/components/atoms/link.svelte";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let dark = false;
</script>

<Accordion.Root
  class={cn(
    "w-full md:text-lg",
    dark ? "text-background *:border-b-white/25" : "",
    className,
  )}
>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Vad är Digitutor?</Accordion.Trigger>
    <Accordion.Content
      >Digitutor är en plattform för studenter, elever eller
      programmeringsintresserade att hitta privatlärare.</Accordion.Content
    >
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Varför använda {websiteName}?</Accordion.Trigger>
    <Accordion.Content
      >Det finns idag ingen lättillgänglig eller prisvärd tjänst för studenter
      att hitta privatlärare i programmering. Det enda alternativ som finns
      kostar ungefär 500 SEK per månad. <span class="font-bold"
        >Vi vill erbjuda en bättre tjänst, till ett bättre pris</span
      >.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Trigger>Vad är premium?</Accordion.Trigger>
    <Accordion.Content
      >Ett prenumeration som gör att du kan kontakta oändligt med lärare.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-4">
    <Accordion.Trigger>När kan jag avbryta prenumerationen?</Accordion.Trigger>
    <Accordion.Content
      >När du vill. Du betalar bara nästkommande betalning och sedan avbryts
      prenumerationen.</Accordion.Content
    >
  </Accordion.Item>
  <Accordion.Item value="item-5">
    <Accordion.Trigger
      >Hur funkar gratis kontaktförfrågningar?</Accordion.Trigger
    >
    <Accordion.Content>
      När du registrerar dig får du automatiskt {freeCredits} gratis kontaktförfrågningar.
      När du sedan kontaktar en lärare förbrukas en av dessa. Om du redan har en
      konversation och chatt med en lärare kan du såklart skicka hur många meddelanden
      du vill till denna lärare. Du kan se hur många återstående kontaktförfrågningar
      du har under
      <Link href="/account/billing">betalningar</Link>.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-6">
    <Accordion.Trigger
      >Vad händer när jag får slut på gratis kontaktförfrågningar?</Accordion.Trigger
    >
    <Accordion.Content>
      Förhoppningsvis räcker de {freeCredits} stycken du fick när du skapade ett
      konto gott och väl för att hitta en bra lärare för dig. Om du mot förmodan
      får slut på alla {freeCredits} gratis kontaktförfrågningar kan du prenumera
      på {premiumPlan.name} för {premiumPlan.price}
      {premiumPlan.priceIntervalName} och kontakta oändligt med lärare.
      <br />
      <br />Tycker du att dessa {freeCredits} inte räcker till är du välkommen att
      <Link href="/contact-us">kontakta oss</Link>.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-7" class="border-b-0">
    <Accordion.Trigger>Hur går detta runt?</Accordion.Trigger>
    <Accordion.Content>
      Det gör det inte. Just nu är målet är att ge en så bra tjänst som möjligt,
      utan hänsyn till vinst. Vi vill låta så många som möjligt använda {websiteName}
      för att kunna förbättra innehållet och funktionerna.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
