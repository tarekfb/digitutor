<script lang="ts">
  import type { LayoutData } from "./$types";
  import Navbar from "$lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import { logout } from "src/lib/utils";
  import Footer from "src/lib/components/organisms/footer.svelte";

  import { websiteName } from "$lib/shared/constants/constants";
  import Link from "$lib/components/atoms/link.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  const linkStyle = "self-start h-6";

  export let data: LayoutData;
  // export let data: PageData;
  $: ({ supabase, session, profile } = data);
</script>

<!-- <Navbar {profile} logout={() => logout(supabase, session)} />

<div class="flex flex-col flex-1 items-center gap-y-4">
  <slot />
</div>

<Footer /> -->

<div class="flex flex-col min-h-screen">
  <Navbar {profile} logout={() => logout(supabase, session)} />

  <main class="flex-1 flex flex-col">
    <slot />
  </main>
</div>

<!-- <div class="flex flex-col min-h-screen">
  <Navbar {profile} logout={() => logout(supabase, session)} />

  <main class="flex-1 flex flex-col test-border">
    <div class="flex justify-between flex-1 test-border">
      <div class="w-full flex items-center justify-center">
        <p>some text</p>
      </div>
      <div class="w-full">
        <p>content</p>
      </div>
    </div>
  </main>
  <footer>
    <Separator />
    <div class="flex justify-between py-10 px-16">
      <Link href="/" class="self-center font-normal">
        <h1 class="text-4xl md:text-5xl text-gradient">{websiteName}</h1>
      </Link>

      <nav class="flex flex-col space-y-1">
        <span class="font-semibold">UTFORSKA</span>
        <Link href="/" class={linkStyle}>Hem</Link>
        <Link href="/sign-up" class={linkStyle}>Skapa konto</Link>
        <Link href="/faq" class={linkStyle}>Vanliga frågor</Link>
        <Link href="/contact-us" class={linkStyle}>Kontakta oss</Link>
      </nav>
    </div>
  </footer>
</div>  -->
