<script lang="ts">
  import type { CreditsProduct } from "src/lib/shared/models/subscription.js";
  import { Button } from "../ui/button/index.ts";
  import { goto } from "$app/navigation";
  import ExternalLink from "lucide-svelte/icons/external-link";

  export let creditsProduct: CreditsProduct;
  const href = `/account/subscribe/${creditsProduct.stripePriceId}?mode=payment`;
</script>

<a
  {href}
  aria-label="Köp {creditsProduct.credits} krediter"
  class="h-full w-full transition-all ease-in-out hover:scale-105 md:h-36 md:w-52"
>
  <li
    class="flex h-full flex-col items-center justify-center gap-y-2 rounded-md border border-solid border-accent bg-card p-4 md:gap-y-4 md:p-8"
  >
    <div
      class="flex flex-1 flex-col items-center justify-center gap-y-1 md:gap-y-2"
    >
      <div class="text-xl text-accent md:text-2xl">
        {creditsProduct.credits} krediter
      </div>
      <p class="text-bold text-muted-foreground md:text-lg">
        {creditsProduct.price}
      </p>
    </div>
    <Button
      variant="accent"
      class="flex items-center gap-x-2"
      on:click={() => goto(href)}><ExternalLink class="size-5" />Köp</Button
    >
  </li>
</a>
