<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { cn } from "$lib/utils.js";

  export let title: string;
  export let description: string;
  export let variant: "default" | "destructive" | "success" | "warning" =
  "default";
  
  let className: string | null | undefined = undefined;
  export { className as class };
  export let descriptionClass: string | null | undefined = undefined;
</script>

<Alert.Root {variant} class={cn("bg-card text-center", className)}>
  <Alert.Title>{title}</Alert.Title>
  <Alert.Description class={descriptionClass}>{description}</Alert.Description>
  <slot />
</Alert.Root>
