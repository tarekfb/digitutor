<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { type Variant, alertVariants } from "./index.js";
  import { cn } from "src/lib/shared/utils/utils.js";
  import Button from "../button/button.svelte";
  import { X } from "lucide-svelte";

  type $$Props = HTMLAttributes<HTMLDivElement> & {
    variant?: Variant;
    closable?: boolean;
  };

  let className: $$Props["class"] = undefined;
  export let variant: $$Props["variant"] = "default";
  export { className as class };
  export let closable: $$Props["closable"] = false;

  let visible = true;
</script>

{#if visible}
  <div
    class={cn(alertVariants({ variant }), className, "[&:has(svg)]:pl-4")}
    {...$$restProps}
    role="alert"
  >
    {#if closable}
      <Button
        variant="ghost-none"
        size="icon"
        on:click={() => (visible = false)}
        class="absolute right-0 top-0"
        aria-label="Stäng meddelande"><X size="20" /></Button
      >
    {/if}
    <slot />
  </div>
{/if}
