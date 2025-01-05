<script lang="ts">
  import { EyeIcon, EyeOffIcon } from "lucide-svelte";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { cn } from "src/lib/shared/utils/utils.js";

  export let formData;
  export let attrs;
  export let placeholder: string = "Lösenord";
  export let bgStyling: string = "";
  let show = false;

  let className: string | null | undefined = undefined;
  export { className as class };
</script>

{#if show}
  <Input
    {...attrs}
    type="text"
    bind:value={$formData[attrs.name]}
    {placeholder}
    autocomplete="off"
    class={cn(className, bgStyling)}
  >
    <Button
      slot="icon"
      variant="ghost"
      class="{bgStyling}"
      on:click={() => (show = false)}
    >
      <EyeOffIcon class="md:hover:text-background" />
    </Button>
  </Input>
{:else}
  <Input
    {...attrs}
    type="password"
    bind:value={$formData[attrs.name]}
    autocomplete="off"
    class={cn(className, bgStyling)}
    {placeholder}
  >
    <Button
      slot="icon"
      class={bgStyling}
      variant="ghost"
      on:click={() => (show = true)}
    >
      <EyeIcon class="md:hover:text-background" />
    </Button>
  </Input>
{/if}
