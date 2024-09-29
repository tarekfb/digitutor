<script>
  import { page } from "$app/stores";
  import Error from "$lib/components/organisms/error.svelte";

  const title =
    $page.error?.message === "Internal error"
      ? undefined
      : $page.error?.message;
</script>

<Error {title} code={$page.status} />
