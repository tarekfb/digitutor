<script lang="ts">
  import Error from "$lib/components/organisms/error.svelte";
  import { page } from "$app/stores";
  import Navbar from "src/lib/components/organisms/navbar.svelte";
  import { defaultErrorInfo } from "src/lib/shared/constants/constants";
</script>

<Navbar profile={false} logout={false} />
<Error error={$page.error ?? defaultErrorInfo} code={$page.status} />
