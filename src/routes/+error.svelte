<script lang="ts">
  import { websiteName } from "$lib/shared/constants/constants";
  import Error from "$lib/components/organisms/error.svelte";
  import { page } from "$app/stores";
  import Navbar from "src/lib/components/organisms/navbar.svelte";

  const title =
    $page.error?.message === "Internal Error"
      ? undefined
      : $page.error?.message;
</script>

<Navbar profile={false} logout={false} />
<Error {title} code={$page.status} />
