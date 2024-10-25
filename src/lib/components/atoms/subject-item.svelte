<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { Terminal } from "lucide-svelte";
  import { Subjects } from "src/lib/shared/models/common";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let iconStyling = "";
  export let textStyling = "";
  export let subject;
</script>

<li class={cn("flex gap-x-2 items-center", className)}>
  <Terminal class={cn("w-5 h-5 text-accent", iconStyling)} />
  <p class={cn("font-mono md:text-lg", textStyling)}>{Subjects[subject]}</p>
</li>
