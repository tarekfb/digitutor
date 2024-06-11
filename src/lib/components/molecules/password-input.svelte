<script lang="ts">
  import { EyeIcon, EyeOffIcon } from "lucide-svelte";
  import { Input } from "src/lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  let show = false;
  export let formData;
  export let attrs;
  export let placeholder: string = "Lösenord";
</script>

<!-- todo bind data properly (now static)
and also update in password settigngs -->
{#if show}
  <Input
    {...attrs}
    type="text"
    bind:value={$formData[attrs.name]}
    {placeholder}
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
    {placeholder}
  >
    <Button slot="icon" variant="ghost" on:click={() => (show = true)}>
      <EyeIcon />
    </Button>
  </Input>
{/if}
