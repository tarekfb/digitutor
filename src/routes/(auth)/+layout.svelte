<script lang="ts">
  import type { LayoutData } from "./$types.ts";
  import Navbar from "$lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import { logout } from "src/lib/shared/utils/utils.ts";
  import Footer from "src/lib/components/organisms/footer.svelte";
  export let data: LayoutData;

  $: ({ supabase, session, profile } = data);
  // profile should always be null
  // ts will complain if not true
  const profileChecked: null = profile;
</script>

<div class="flex min-h-screen flex-col">
  <Navbar profile={profileChecked} logout={() => logout(supabase, session)} />

  <main class="flex flex-1 flex-col items-center">
    <slot />
  </main>
</div>
<Footer />
