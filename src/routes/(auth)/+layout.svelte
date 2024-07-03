<script lang="ts">
  import type { LayoutData } from "./$types";
  import Navbar from "$lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import { logout } from "src/lib/utils";
  export let data: LayoutData;
  $: ({ supabase, session, profile } = data);
</script>

<div class="flex flex-col min-h-screen">
  <Navbar {profile} logout={() => logout(supabase, session)} />

  <main class="flex-1 flex flex-col items-center">
    <slot />
  </main>
</div>
