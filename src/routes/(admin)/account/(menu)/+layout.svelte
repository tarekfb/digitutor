<script lang="ts">
  import type { PageData } from "./$types.ts";
  import { logout } from "src/lib/shared/utils/utils.ts";
  import Navbar from "src/lib/components/organisms/navbar.svelte";
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";
  import { getFlash } from "sveltekit-flash-message/client";
  import { goto } from "$app/navigation";

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

<Navbar
  {profile}
  logout={() => {
    logout(supabase, session);
    goto("/sign-in");
  }}
></Navbar>
<slot />
