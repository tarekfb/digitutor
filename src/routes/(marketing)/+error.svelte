<script>
  import { page } from "$app/stores";
  import Error from "$lib/components/organisms/error.svelte";
</script>

<Error error={$page.error} code={$page.status} />
