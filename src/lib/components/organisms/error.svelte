<script lang="ts">
  import Home from "lucide-svelte/icons/home";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import ErrorNav from "$lib/components/atoms/error-nav.svelte";
  import MessageCircle from "lucide-svelte/icons/message-circle";
  import UserRound from "lucide-svelte/icons/user-round";
  import Bug from "lucide-svelte/icons/bug";
  import {
    defaultErrorTitle,
    getDefaultErrorInfo,
  } from "src/lib/shared/constants/constants.ts";
  import Footer from "./footer.svelte";

  export let error: App.Error;
  export let code: number | undefined | null = undefined;

  const getTitle = (error: App.Error): string => {
    if (!error.message || error.message === "Internal Error")
      return defaultErrorTitle;
    return error.message;
  };

  const getDescription = (error: App.Error): string => {
    if (error.message === "Internal Error" || !error.description)
      return getDefaultErrorInfo().description;
    return error.description;
  };

  // const {id, data} = error; // not using atm, implement when needed

  const iconStyling = "w-4 h-4 md:w-5 md:h-5 text-accent";
</script>

<div
  class="m-8 flex min-w-[20rem] flex-col items-center gap-y-4 self-center text-center md:min-w-[48rem] md:gap-y-6 lg:min-w-[60rem]"
>
  <div class="flex flex-col items-center gap-y-4 md:gap-y-6">
    <PrimaryTitle class="text-4xl font-normal md:text-5xl"
      >{getTitle(error)}</PrimaryTitle
    >
    {#if code}
      <p class="font-mono text-3xl text-accent md:text-4xl">{code}</p>
    {/if}
    <p class="max-w-md text-xl text-muted-foreground md:text-2xl">
      {getDescription(error)}
    </p>
  </div>
  <ul class="h-62 mt-4 flex w-3/4 flex-col gap-4 md:mt-6 md:w-full md:flex-row">
    {#if error.trackingId}
      <ErrorNav text="Rapportera fel" href="/report-bug?id={error.trackingId}">
        <Bug class={iconStyling} />
      </ErrorNav>
    {/if}
    <ErrorNav text="Tillbaka till startsidan" href="/">
      <Home class={iconStyling} />
    </ErrorNav>
    <ErrorNav text="Gå till ditt konto" href="/account">
      <UserRound class={iconStyling} />
    </ErrorNav>
    <ErrorNav text="Kontakta oss" href="/contact-us">
      <MessageCircle class={iconStyling} />
    </ErrorNav>
  </ul>
</div>
<Footer />
