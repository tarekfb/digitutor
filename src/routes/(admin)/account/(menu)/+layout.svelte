<script lang="ts">
  import { writable } from "svelte/store";
  import { setContext } from "svelte";
  import SidebarNav from "src/lib/components/organisms/sidebar-nav.svelte";

  export let data;
  const conversations = data.conversations ?? [];
  const adminSectionStore = writable("");
  setContext("adminSection", adminSectionStore);
  let adminSection: string;
  adminSectionStore.subscribe((value) => {
    adminSection = value;
  });
</script>

<div class="flex p-8 ml-14 min-h-screen">
  <SidebarNav {conversations} role={data.profile?.role ?? "user"} />
  <div class="flex-1 lg:max-w-2xl">
    <slot />
  </div>
</div>
