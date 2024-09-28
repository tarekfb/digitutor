<!-- {title: string, description: string, status: number} -->
<script lang="ts">
  import "src/app.pcss";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import { Home } from "lucide-svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import ErrorNav from "$lib/components/atoms/error-nav.svelte";
  import { CircleHelp } from "lucide-svelte";

  import { UserRound } from "lucide-svelte";
  export let title: string = "Det här va lite pinsamt...";
  export let description =
    "Ett oväntat fel uppstod. Du kan kontakta oss om detta fortsätter.";
  export let code: number = 404;

  const iconStyling = "w-4 h-4 md:w-5 md:h-5 text-accent";
</script>

<div
  class="max-w-[42rem] text-center flex flex-col items-center gap-y-4 md:gap-y-6 self-center m-8"
>
  <div class="max-w-md flex flex-col items-center gap-y-4 md:gap-y-6">
    <PrimaryTitle class="text-4xl md:text-5xl font-normal">{title}</PrimaryTitle
    >
    {#if code !== 0}
      <p class="text-3xl md:text-4xl text-accent font-mono">{code}</p>
    {/if}
    <p class="text-xl md:text-2xl text-muted-foreground">
      {description}
    </p>
  </div>
  <ul class="flex flex-col w-full h-62 gap-4 md:flex-row mt-4 md:mt-6">
    <ErrorNav text="Kontakta oss" href="/contact-us">
      <CircleHelp class={iconStyling} />
    </ErrorNav>
    <ErrorNav text="Tillbaka till startsidan" href="/">
      <Home class={iconStyling} />
    </ErrorNav>
    <ErrorNav text="Gå till din profil" href="/profile">
      <UserRound class={iconStyling} />
    </ErrorNav>
  </ul>
</div>
