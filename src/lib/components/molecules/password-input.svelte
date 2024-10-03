<script lang="ts">
  import { EyeIcon, EyeOffIcon } from "lucide-svelte";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";

  export let formData;
  export let attrs;
  export let placeholder: string = "Lösenord";
  let show = false;
</script>

{#if show}
  <Input
    {...attrs}
    type="text"
    bind:value={$formData[attrs.name]}
    {placeholder}
    autocomplete="off"
  >
    <Button slot="icon" variant="ghost" on:click={() => (show = false)}>
      <EyeOffIcon />
    </Button>
  </Input>
{:else}
  <Input
    {...attrs}
    type="password"
    bind:value={$formData[attrs.name]}
    autocomplete="off"
    {placeholder}
  >
    <Button slot="icon" variant="ghost" on:click={() => (show = true)}>
      <EyeIcon />
    </Button>
  </Input>
{/if}
