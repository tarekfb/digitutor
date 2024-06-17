<script lang="ts">
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import Link from "$lib/components/atoms/link.svelte";
</script>

<svelte:head>
  <title>Current Password Incorrect</title>
</svelte:head>

<div class="flex flex-col gap-y-2 generic-card">
  <PrimaryTitle class="mb-2">Lösenordet stämde inte</PrimaryTitle>
  <p>
    Du försökte göra en ändring på ditt konto men angav fel lösenord. Du har
    därför loggats ut.
  </p>
  <p>
    Om du minns ditt lösenord, kan du <Link href="/auth/sign-in">logga in</Link>
    och försöka igen.
  </p>
  <p>
    Om du har glömt ditt lösenord kan du <Link href="/auth/forgot-password"
      >återställa det</Link
    >.
  </p>
</div>
