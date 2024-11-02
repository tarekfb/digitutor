<script lang="ts">
  import Error from "$lib/components/organisms/error.svelte";
  import { page } from "$app/stores";
  import Navbar from "src/lib/components/organisms/navbar.svelte";
</script>

<Navbar profile={false} logout={false} />
<Error error={$page.error} code={$page.status} />
