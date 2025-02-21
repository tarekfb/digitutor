<script lang="ts">
  import { Drawer as DrawerPrimitive } from "vaul-svelte";
  import DrawerOverlay from "./drawer-overlay.svelte";
  import { cn } from "src/lib/shared/utils/utils.js";

  type $$Props = DrawerPrimitive.ContentProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<DrawerPrimitive.Portal>
  <DrawerOverlay />
  <DrawerPrimitive.Content
    class={cn(
      "fixed inset-y-0 right-0 z-50 ml-24 flex h-full rounded-l-[10px] border bg-background",
      className,
    )}
    {...$$restProps}
  >
    <slot />
  </DrawerPrimitive.Content>
</DrawerPrimitive.Portal>
