<script lang="ts">
  import { Home } from "lucide-svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import ErrorNav from "$lib/components/atoms/error-nav.svelte";
  import { CircleHelp } from "lucide-svelte";
  import { UserRound } from "lucide-svelte";
  import { unknownErrorTitle } from "src/lib/shared/constants/constants";

  export let error: App.Error | null;
  export let code: number | undefined | null = undefined;

  const description =
    error?.description ??
    "Ett oväntat fel uppstod. Du kan kontakta oss om detta fortsätter.";
  const title = error?.message ?? unknownErrorTitle;

  // const {id, data} = error; // not using atm, implement when needed

  const iconStyling = "w-4 h-4 md:w-5 md:h-5 text-accent";
</script>

<div
  class="max-w-[42rem] md:max-w-[60rem] text-center flex flex-col items-center gap-y-4 md:gap-y-6 self-center m-8"
>
  <div class=" flex flex-col items-center gap-y-4 md:gap-y-6">
    <PrimaryTitle class="text-4xl md:text-5xl font-normal whitespace-normal"
      >{title}</PrimaryTitle
    >
    {#if code}
      <p class="text-3xl md:text-4xl text-accent font-mono">{code}</p>
    {/if}
    <p class="text-xl md:text-2xl text-muted-foreground max-w-md">
      {description}
    </p>
  </div>
  <ul class="flex flex-col w-full h-62 gap-4 md:flex-row mt-4 md:mt-6">
    <ErrorNav text="Tillbaka till startsidan" href="/">
      <Home class={iconStyling} />
    </ErrorNav>
    <ErrorNav text="Gå till din profil" href="/profile">
      <UserRound class={iconStyling} />
    </ErrorNav>
    <ErrorNav text="Kontakta oss" href="/contact-us">
      <CircleHelp class={iconStyling} />
    </ErrorNav>
  </ul>
</div>
