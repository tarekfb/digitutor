<script lang="ts">
  import { writable } from "svelte/store";
  import { setContext } from "svelte";
  import SidebarNav from "src/lib/components/organisms/sidebar-nav.svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";

  export let data;
  const conversations = data.conversations ?? [];
  const adminSectionStore = writable("");
  setContext("adminSection", adminSectionStore);
  let adminSection: string;
  adminSectionStore.subscribe((value) => {
    adminSection = value;
  });
</script>

<div class="space-y-6 p-8 ml-14 pb-16 md:block">
  <div class="space-y-2">
    <h2 class="text-3xl font-bold tracking-tight">Profil</h2>
    <p class="text-muted-foreground">
      Hantera konversationer, annonser och din profil.
    </p>
  </div>
  <Separator class="my-4" />
  <div class="flex flex-row sm:flex-col sm:space-y-8 sm:space-x-0">
    <SidebarNav {conversations} role={data.profile?.role ?? "user"} />
    <div class="flex-1 lg:max-w-2xl">
      <slot />
    </div>
  </div>
</div>
