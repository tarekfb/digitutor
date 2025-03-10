<script lang="ts">
  import type { LayoutData } from "./$types.ts";
  import Navbar from "$lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import { logout } from "src/lib/shared/utils/utils.ts";
  import Footer from "src/lib/components/organisms/footer.svelte";
  import SearchForm from "src/lib/components/organisms/search-form.svelte";
  export let data: LayoutData;

  $: ({ supabase, session, subjects } = data);
</script>

<div class="flex min-h-screen flex-col">
  <Navbar profile={undefined} logout={() => logout(supabase, session)}>
    <svelte:fragment slot="searchForm">
      <SearchForm form={data.searchForm} {subjects} />
    </svelte:fragment>
  </Navbar>

  <main class="flex flex-1 flex-col items-center">
    <slot />
  </main>
</div>
<Footer />
