<script lang="ts">
  import { writable } from "svelte/store";
  import { setContext } from "svelte";
  import Sidebar from "src/lib/components/organisms/sidebar.svelte";
  import type { PageData } from "./$types";
  import { logout } from "src/lib/utils";
  import Navbar from "src/lib/components/organisms/navbar.svelte";

  export let data: PageData;
  $: ({ supabase, session, profile } = data);

  const adminSectionStore = writable("");
  setContext("adminSection", adminSectionStore);
  let adminSection: string;
  adminSectionStore.subscribe((value) => {
    adminSection = value;
  });
</script>

<Navbar profile={false} logout={false}>
  <Sidebar role={profile?.role} logout={() => logout(supabase, session)} />
</Navbar>
<div class="flex justify-center p-8 min-h-screen">
  <div class="flex-1 flex flex-col items-center lg:max-w-2xl">
    <slot />
  </div>
</div>
