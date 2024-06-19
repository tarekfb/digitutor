<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { cn } from "$lib/utils.js";

  export let title: string;
  export let description: string;
  export let variant: "default" | "destructive" | "success" | "warning" =
    "default";

  let className: string | null | undefined = undefined;
  export { className as class };
</script>

<Alert.Root {variant} class={cn("bg-card text-center", className)}>
  <Alert.Title>{title}</Alert.Title>
  <Alert.Description>{description}</Alert.Description>
  <slot />
</Alert.Root>
