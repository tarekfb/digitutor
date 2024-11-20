<script lang="ts">
  import type { LayoutData } from "./$types";
  import Navbar from "$lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import { logout } from "src/lib/shared/utils/utils";
  export let data: LayoutData;

  $: ({ supabase, session, profile } = data);
  // profile should always be null
  // ts will complain if not true
  const profileChecked: null = profile;
</script>

<div class="flex flex-col min-h-screen">
  <Navbar profile={profileChecked} logout={() => logout(supabase, session)} />

  <main class="flex-1 flex flex-col items-center">
    <slot />
  </main>
</div>
