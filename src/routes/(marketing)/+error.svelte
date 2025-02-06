<script>
  import { page } from "$app/stores";
  import Error from "$lib/components/organisms/error.svelte";
  import { defaultErrorInfo } from "src/lib/shared/constants/constants.ts";
</script>

<Error error={$page.error ?? defaultErrorInfo} code={$page.status} />
