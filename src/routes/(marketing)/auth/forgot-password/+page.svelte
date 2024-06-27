<script lang="ts">
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  export let data;
</script>

<svelte:head>
  <title>Forgot Password</title>
</svelte:head>
<!-- redirectTo={`${data.url}/auth/callback?next=%2Faccount%2Fsettings%2Freset_password`} -->

<PrimaryTitle>Glömt lösenord</PrimaryTitle>
<SecondaryTitle>Not implemented</SecondaryTitle>
