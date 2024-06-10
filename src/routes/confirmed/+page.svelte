<script lang="ts">
  import { websiteName } from "$lib/constants";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Button } from "$lib/components/ui/button";
  import { CheckCircle2 } from "lucide-svelte";
  import { goto } from "$app/navigation";
</script>

<svelte:head>
  <title>{websiteName} | Verifiera e-post</title>
  <meta name="description" content="{websiteName} email confirmation" />
</svelte:head>

<!-- todo: make component -->
<header
  class="sticky top-0 z-40 w-full bg-gradient-to-r from-primary to-accent text-background px-1"
>
  <div
    class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0"
  >
    <a href="/" class="text-2xl font-semibold">
      {websiteName}
    </a>
  </div>
</header>
<div class="m-8 text-center flex flex-col gap-y-8 items-center">
  <CheckCircle2 size="120" class="text-success" />
  <Alert.Root
    variant="success"
    class="bg-card flex flex-col space-y-4 text-center items-center"
  >
    <Alert.Title class="flex items-center gap-x-2 text-3xl md:text-6xl"
      >E-post verifierad!</Alert.Title
    >
    <Alert.Description
      class="text-xl md:text-2xl flex flex-col gap-y-4 justify-center"
      >Du kan nu fortsätta.

      <!-- todo apply btn-wide --></Alert.Description
    >
  </Alert.Root>
  <Button on:click={() => goto("/account")}>Gå till ditt konto</Button>
</div>
