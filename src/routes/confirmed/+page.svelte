<script lang="ts">
  import { websiteName } from "$lib/shared/constants/constants.ts";
  import { Button } from "$lib/components/ui/button/index.js";
  import CheckCircle2 from "lucide-svelte/icons/check-circle-2";
  import UserRound from "lucide-svelte/icons/user-round";
  import { goto } from "$app/navigation";
  import Navbar from "src/lib/components/organisms/navbar.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import Container from "src/lib/components/templates/container.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
</script>

<svelte:head>
  <title>{websiteName} | E-post verifierad</title>
  <meta name="description" content="{websiteName} email confirmation" />
</svelte:head>

<Navbar profile={false} logout={false}>
  <Button on:click={() => goto("/account")}>
    <UserRound class="mr-2 h-4 w-4" />
    Konto
  </Button>
</Navbar>

<Container class="self-center text-center" padding maxWidth minWidth>
  <CheckCircle2 size="100" class="text-success" />
  <div class="space-y-2 md:space-y-4">
    <PrimaryTitle class="text-3xl font-semibold md:text-5xl">
      E-post verifierad!
    </PrimaryTitle>
    <SecondaryTitle class="text-muted-foreground"
      >Du kan nu fortsätta.</SecondaryTitle
    >
  </div>

  <Button on:click={() => goto("/account")} class="md:min-w-wider"
    >Gå till ditt konto</Button
  >
</Container>
