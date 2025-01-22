<script lang="ts">
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import Link from "$lib/components/atoms/link.svelte";
  import { websiteName } from "src/lib/shared/constants/constants";
</script>

<svelte:head>
  <title>{websiteName} | Inkorrekt lösenord</title>
</svelte:head>

<div
  class="m-8 flex flex-col items-center justify-center gap-y-2 text-center md:max-w-xl"
>
  <PrimaryTitle class="mb-2">Lösenordet stämde inte</PrimaryTitle>
  <p>
    Du försökte göra en ändring på ditt konto men angav fel lösenord. Du har
    därför loggats ut.
  </p>
  <p>
    Om du minns ditt lösenord, kan du <Link href="/sign-in">logga in</Link>
    och försöka igen.
  </p>
  <p>
    Om du har glömt ditt lösenord kan du <Link href="/forgot-password"
      >återställa det</Link
    >.
  </p>
</div>
