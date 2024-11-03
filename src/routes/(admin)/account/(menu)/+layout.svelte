<script lang="ts">
  import Sidebar from "src/lib/components/organisms/sidebar.svelte";
  import type { PageData } from "./$types";
  import { logout } from "src/lib/shared/utils/utils";
  import Navbar from "src/lib/components/organisms/navbar.svelte";
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";
  import { getFlash } from "sveltekit-flash-message/client";
  import Footer from "src/lib/components/organisms/footer.svelte";

  export let data: PageData;
  $: ({ supabase, session, profile } = data);

  const flash = getFlash(page);

  $: if ($flash) {
    switch ($flash.type) {
      case "success":
        toast.success($flash.message);
        break;
      case "warning":
        toast.warning($flash.message);
        break;
      case "info":
        toast.info($flash.message);
        break;
      case "error":
        toast.error($flash.message);
        break;
      default:
        break;
    }

    // Clear the flash message to avoid double-toasting.
    $flash = undefined;
  }
</script>

<Navbar profile={false} logout={false}>
  <Sidebar role={profile?.role} logout={() => logout(supabase, session)} />
</Navbar>
<div class="flex justify-center p-8 min-h-screen">
  <div
    class="flex flex-col items-center w-full max-w-[340px] md:max-w-xl lg:max-w-2xl"
  >
    <slot />
  </div>
</div>
<Footer />
