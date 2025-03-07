<script lang="ts">
  import Navbar from "$lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import type { PageData } from "./$types.ts";
  import { logout } from "src/lib/shared/utils/utils.ts";
  import Footer from "src/lib/components/organisms/footer.svelte";
  import { page } from "$app/stores";
  import SearchForm from "src/lib/components/organisms/search-form.svelte";

  export let data: PageData;
  $: ({ supabase, session, profile, subjects } = data);
</script>

{#if $page.url.pathname !== "/search"}
  <Navbar {profile} logout={() => logout(supabase, session)}>
    <svelte:fragment slot="searchForm">
      <SearchForm form={data.searchForm} {subjects} />
    </svelte:fragment>
  </Navbar>
{:else}
  <Navbar {profile} logout={() => logout(supabase, session)} />
{/if}

<div class="flex flex-col items-center overflow-x-hidden">
  <slot />
</div>
<Footer />
