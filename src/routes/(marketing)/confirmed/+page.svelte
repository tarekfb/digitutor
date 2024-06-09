<script lang="ts">
  import { websiteName } from "$lib/constants";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Button } from "$lib/components/ui/button";
  import { CheckCircle2 } from "lucide-svelte";
  import { goto } from "$app/navigation";
</script>

<svelte:head>
  <title>{websiteName} | Verifierad</title>
  <meta name="description" content="{websiteName} email confirmation" />
</svelte:head>

<CheckCircle2 size="120" class="text-success" />
<Alert.Root
  variant="success"
  class="bg-card flex flex-col space-y-4 text-center items-center"
>
  <Alert.Title class="flex items-center gap-x-2 text-3xl md:text-6xl"
    >E-post verifierad!</Alert.Title
  >
  <Alert.Description class="text-xl md:text-2xl"
    >Du kan nu fortsätta.</Alert.Description
  >
</Alert.Root>

<Button on:click={() => goto("/account")}>Konto</Button>
<!-- todo apply btn-wide -->
