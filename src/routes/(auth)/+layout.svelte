<script lang="ts">
  import type { LayoutData } from "./$types.ts";
  import Navbar from "$lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import { logout } from "src/lib/shared/utils/utils.ts";
  import Footer from "src/lib/components/organisms/footer.svelte";
  export let data: LayoutData;

  $: ({ supabase, session } = data);
</script>

<div class="flex min-h-screen flex-col">
  <Navbar profile={null} logout={() => logout(supabase, session)} />

  <main class="flex flex-1 flex-col items-center">
    <slot />
  </main>
</div>
<Footer />
