<script lang="ts">
  import { Drawer as DrawerPrimitive } from "vaul-svelte";
  import DrawerOverlay from "./drawer-overlay.svelte";
  import { cn } from "$lib/utils.js";

  type $$Props = DrawerPrimitive.ContentProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
  const swipable = className?.includes("swipable");
</script>

<DrawerPrimitive.Portal>
  <DrawerOverlay />
  {#if swipable}
    <DrawerPrimitive.Content
      class={cn(
        "fixed inset-y-0 right-0 z-50 ml-24 grid grid-cols-6 h-full rounded-l-[10px] border bg-background",
        className,
      )}
      {...$$restProps}
    >
      <div
        class="my-auto mx-2 md:mx-4 w-1.5 h-3/5 rounded-full bg-muted-foreground/75 justify-self-start col-start-1"
      ></div>
      <div class="flex flex-col gap-y-4 col-start-2 col-span-4">
        <slot />
      </div>
    </DrawerPrimitive.Content>
  {:else}
    <DrawerPrimitive.Content
      class={cn(
        "fixed inset-y-0 right-0 z-50 ml-24 flex flex-col h-full rounded-l-[10px] border bg-background",
        className,
      )}
      {...$$restProps}
    >
      <slot />
    </DrawerPrimitive.Content>
  {/if}
</DrawerPrimitive.Portal>
