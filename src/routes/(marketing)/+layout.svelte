<script lang="ts">
  import Navbar from "$lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import type { PageData } from "./$types.ts";
  import { logout } from "src/lib/shared/utils/utils.ts";
  import Footer from "src/lib/components/organisms/footer.svelte";
  import { page } from "$app/stores";

  export let data: PageData;
  $: ({ supabase, session, profile } = data);
</script>

{#if $page.url.pathname !== "/"}
  <Navbar {profile} logout={() => logout(supabase, session)}/>
{/if}
<div class="flex flex-col items-center overflow-x-hidden">
  <slot />
</div>
<Footer />
