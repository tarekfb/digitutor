<script lang="ts">
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import Link from "$lib/components/atoms/link.svelte";
  import { websiteName } from "src/lib/shared/constants/constants.ts";
  import Container from "src/lib/components/templates/container.svelte";
</script>

<svelte:head>
  <title>{websiteName} | Inkorrekt lösenord</title>
</svelte:head>

<Container
  class="w-full items-start self-center pt-0"
  
  margin
  padding
  responsiveGap
  maxWidth
  minWidth
>
  <PrimaryTitle responsiveMb class="self-center"
    >Lösenordet stämde inte</PrimaryTitle
  >
  <p class="text-muted-foreground">
    Du försökte göra en ändring på ditt konto men angav fel lösenord. Du har
    därför loggats ut.
  </p>
  <p class="text-muted-foreground">
    Om du minns ditt lösenord, kan du <Link href="/sign-in">logga in</Link>
    och försöka igen.
  </p>
  <p class="text-muted-foreground">
    Om du har glömt ditt lösenord kan du <Link href="/forgot-password"
      >återställa det</Link
    >.
  </p>
</Container>
