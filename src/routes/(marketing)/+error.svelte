<script>
  import { page } from "$app/stores";
  import Error from "$lib/components/organisms/error.svelte";
  $: console.log("error is", $page?.error?.message); // Internal error
</script>

<Error />
