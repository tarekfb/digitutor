<script lang="ts">
  import type { LayoutData } from "./$types";
  import Navbar from "$lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import { logout } from "src/lib/utils";
  import Footer from "src/lib/components/organisms/footer.svelte";

  export let data: LayoutData;
  // export let data: PageData;
  $: ({ supabase, session, profile } = data);
</script>

<Navbar {profile} logout={() => logout(supabase, session)} />

<div class="flex flex-col items-center m-8 gap-y-4">
  <slot />
</div>

<Footer />
