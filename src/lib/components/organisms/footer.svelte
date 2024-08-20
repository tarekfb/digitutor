<script lang="ts">
  import { websiteName } from "$lib/shared/constants/constants";
  import Link from "../atoms/link.svelte";
  import Separator from "../ui/separator/separator.svelte";
  const linkStyle = "self-start h-6";
</script>

<!-- Spacer grows so the footer can be at bottom on short pages -->
<div class="flex-grow"></div>
<Separator />
<footer class="flex justify-between py-10 px-16">
  <Link href="/" class="self-center font-normal">
    <h1 class="text-4xl md:text-5xl text-gradient">{websiteName}</h1>
  </Link>

  <nav class="flex flex-col space-y-1">
    <span class="font-semibold uppercase">Utforska</span>
    <Link href="/" class={linkStyle}>Hem</Link>
    <Link href="/sign-up" class={linkStyle}>Skapa konto</Link>
    <Link href="/faq" class={linkStyle}>Vanliga frågor</Link>
    <Link href="/contact-us" class={linkStyle}>Kontakta oss</Link>
    <Link href="/tips" class={linkStyle}>Tips</Link>
  </nav>
</footer>
