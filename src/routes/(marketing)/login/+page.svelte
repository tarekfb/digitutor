<script>
  import { goto } from "$app/navigation";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import { Button } from "src/lib/components/ui/button";
</script>

<svelte:head>
  <title>Logga in</title>
</svelte:head>

<div class="flex flex-col gap-y-6 generic-card">
  <PrimaryTitle>Kom igång - skapa konto</PrimaryTitle>
  <Button on:click={() => goto("/login/sign_up")} class="self-center"
    >Skapa konto</Button
  >
  <SecondaryTitle>Har du redan ett konto?</SecondaryTitle>
  <Button variant="secondary" on:click={() => goto("/login/sign_in")} class="self-center"
    >Logga in</Button
  >
</div>
