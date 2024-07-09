<script lang="ts">
  import Avatar from "$lib/components/atoms/avatar.svelte";
  import type { Review } from "src/lib/shared/models/review";
  import Stars from "../atoms/stars.svelte";
  import { cn } from "$lib/utils.js";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let review: Review;
</script>

<div
  class={cn(
    "relative flex flex-col gap-y-2 bg-card rounded-md text-center p-2 w-96",
    className,
  )}
>
  {#if review.sender}
    <div class="absolute select-none -top-3 -left-3">
      <span class="text-[120px] leading-none text-primary/40">
        <Avatar
          profile={review.sender}
          onClick={undefined}
          class="text-sm w-8 h-8"
        />
      </span>
    </div>
  {/if}
  {#if review.sender}
    <h4 class="text-lg">{review.sender.first_name}</h4>
  {/if}
  {#if review.description}
    <div class="text-muted-foreground overflow-hidden">
      {review.description}
    </div>
  {/if}
  <Stars size={5} rating={review.rating} class="justify-center" />
  <div class="absolute select-none -bottom-[25px] -right-5 rotate-180">
    <span class="text-[120px] font-[helvetica] leading-none text-slate-400"
      >“</span
    >
  </div>
</div>
