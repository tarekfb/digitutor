<script lang="ts">
  import type { CreditsProduct } from "src/lib/shared/models/subscription.js";

  export let creditsProduct: CreditsProduct;
</script>

<a
  href="/account/subscribe/{creditsProduct.stripePriceId}?mode=payment"
  aria-label="Köp {creditsProduct.credits} krediter"
  class="w-38 h-full transition-all ease-in-out hover:scale-105 md:h-36 md:w-48"
>
  <li
    class="flex h-full items-center justify-center rounded-md border border-solid border-accent bg-card p-6 md:p-8"
  >
    <div
      class="flex flex-1 flex-col items-center justify-center gap-y-2 md:gap-y-4"
    >
      <div
        class="flex items-center justify-center rounded-sm bg-accent/10 p-2 md:p-3"
      >
        {creditsProduct.credits} krediter
      </div>
      <p class="text-bold text-muted-foreground md:text-lg">
        {creditsProduct.price}
      </p>
    </div>
  </li>
</a>
