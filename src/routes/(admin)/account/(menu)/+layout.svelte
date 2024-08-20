<script lang="ts">
  import { writable } from "svelte/store";
  import { setContext } from "svelte";
  import SidebarNav from "$lib/components/organisms/sidebar-nav.svelte";
  import type { PageData } from "./$types";
  import { logout } from "src/lib/utils";

  export let data: PageData;
  $: ({ supabase, session, profile, conversations } = data);

  const adminSectionStore = writable("");
  setContext("adminSection", adminSectionStore);
  let adminSection: string;
  adminSectionStore.subscribe((value) => {
    adminSection = value;
  });
</script>

<div class="flex justify-center p-8 ml-14 min-h-screen">
  <SidebarNav
    {conversations}
    role={profile?.role}
    logout={() => logout(supabase, session)}
  />
  <div class="flex-1 lg:max-w-2xl">
    <slot />
  </div>
</div>
