<script lang="ts">
  import { websiteName } from "$lib/shared/constants/constants";
  import { Button } from "$lib/components/ui/button";
  import { CheckCircle2 } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import Navbar from "src/lib/components/organisms/navbar.svelte";
  import { UserRound } from "lucide-svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
</script>

<svelte:head>
  <title>{websiteName} | E-post verifiering</title>
  <meta name="description" content="{websiteName} email confirmation" />
</svelte:head>

<Navbar profile={false} logout={false}>
  <Button on:click={() => goto("/account")}>
    <UserRound class="mr-2 h-4 w-4" />
    Konto
  </Button>
</Navbar>

<div
  class="m-8 flex max-w-xl flex-col items-center gap-y-6 self-center text-center md:gap-y-8"
>
  <CheckCircle2 size="100" class="text-success" />
  <div class="space-y-2 md:space-y-4">
    <PrimaryTitle class="text-3xl font-semibold md:text-6xl">
      E-post verifierad!
    </PrimaryTitle>
    <SecondaryTitle class="text-muted-foreground"
      >Du kan nu fortsätta.</SecondaryTitle
    >
  </div>

  <Button on:click={() => goto("/account")} class="md:min-w-wider"
    >Gå till ditt konto</Button
  >
</div>
