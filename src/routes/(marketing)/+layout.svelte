<script lang="ts">
  import Navbar from "$lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import type { PageData } from "./$types";
  import { logout } from "src/lib/shared/utils/utils";
  import Footer from "src/lib/components/organisms/footer.svelte";

  export let data: PageData;
  $: ({ supabase, session, profile } = data);
</script>

<Navbar {profile} logout={() => logout(supabase, session)} />
<div class="overflow-x-hidden">
  <slot />
</div>
<Footer />
