<script lang="ts">
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  export let data;
</script>

<svelte:head>
  <title>Forgot Password</title>
</svelte:head>
<!-- redirectTo={`${data.url}/callback?next=%2Faccount%2Fsettings%2Freset_password`} -->

<div
  class="text-center flex flex-col items-center justify-center gap-y-4 md:max-w-xl"
>
  <PrimaryTitle>Glömt lösenord</PrimaryTitle>
  <SecondaryTitle>Not implemented</SecondaryTitle>
</div>
