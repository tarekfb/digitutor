<script lang="ts">
  import { goto } from "$app/navigation";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import { Button } from "$lib/components/ui/button";
</script>

<svelte:head>
  <title>Logga in</title>
</svelte:head>

<div class="flex flex-col gap-y-6 generic-card">
  <PrimaryTitle>Kom igång - skapa konto</PrimaryTitle>
  <Button on:click={() => goto("/auth/sign-up")} class="self-center"
    >Skapa konto</Button
  >
  <SecondaryTitle>Har du redan ett konto?</SecondaryTitle>
  <Button
    variant="secondary"
    on:click={() => goto("/auth/sign-in")}
    class="self-center">Logga in</Button
  >
</div>
