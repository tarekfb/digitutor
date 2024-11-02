<script>
  import { page } from "$app/stores";
  import Error from "$lib/components/organisms/error.svelte";
  import Navbar from "src/lib/components/organisms/navbar.svelte";
</script>

<Navbar profile={false} logout={false} />
<Error error={$page.error} code={$page.status} />
