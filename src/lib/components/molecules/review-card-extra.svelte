<script lang="ts">
  import Avatar from "$lib/components/atoms/avatar.svelte";
  import type { ReviewWithReferences } from "src/lib/shared/models/review.ts";
  import Stars from "../atoms/stars.svelte";
  import { cn } from "src/lib/shared/utils/utils.js";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let review: ReviewWithReferences;
</script>

<div
  class={cn(
    "relative flex w-96 flex-col gap-y-2 rounded-md bg-card p-2 text-center",
    className,
  )}
>
  {#if review.sender}
    <div class="absolute -left-3 -top-3 select-none">
      <span class="text-[120px] leading-none text-primary/40">
        <Avatar
          url={review.sender.avatarUrl ?? ""}
          firstName={review.sender.firstName}
          lastName={review.sender.lastName}
          role={review.sender.role}
          class="h-8 w-8 text-sm"
        />
      </span>
    </div>
  {/if}
  {#if review.sender}
    <h4 class="text-lg">{review.sender.firstName}</h4>
  {/if}
  {#if review.description}
    <div class="overflow-hidden text-muted-foreground">
      {review.description}
    </div>
  {/if}
  <Stars size={5} rating={review.rating} class="justify-center" />
  <div class="absolute -bottom-[25px] -right-5 rotate-180 select-none">
    <span class="font-[helvetica] text-[120px] leading-none text-slate-400"
      >“</span
    >
  </div>
</div>
