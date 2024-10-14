<script lang="ts">
  import Navbar from "$lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import type { PageData } from "./$types";
  import { logout } from "src/lib/utils";
  import Footer from "src/lib/components/organisms/footer.svelte";

  export let data: PageData;
  $: ({ supabase, session, profile } = data);
</script>

<Navbar {profile} logout={() => logout(supabase, session)} />
<div class="flex flex-col items-center m-8 gap-y-4">
  <slot />
</div>
<Footer />
