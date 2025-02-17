<script lang="ts">
  import { websiteName } from "$lib/shared/constants/constants.ts";
  import Link from "../atoms/link.svelte";
  import Separator from "../ui/separator/separator.svelte";

  const linkStyle = "self-start h-6";
</script>

<!-- Spacer grows so the footer can be at bottom on short pages -->
<div class="flex-grow"></div>
<Separator />
<footer
  class="flex flex-col justify-between gap-y-6 px-8 py-6 md:flex-row md:gap-y-0 md:px-16 md:py-10"
>
  <Link href="/" class="self-start font-medium md:self-center">
    <h1 class="text-gradient text-3xl uppercase md:text-5xl">{websiteName}</h1>
  </Link>

  <div
    class="testing flex basis-1/3 justify-between *:flex *:flex-shrink-0 *:flex-col *:gap-y-1 md:justify-evenly md:gap-x-16"
  >
    <nav>
      <span class="font-semibold uppercase">Utforska</span>
      <Link href="/" class={linkStyle}>Hem</Link>
      <Link href="/pricing" class={linkStyle}>Premium</Link>
      <Link href="/search" class={linkStyle}>Sök lärare</Link>
      <Link href="/sign-up" class={linkStyle}>Skapa konto</Link>
    </nav>
    <nav>
      <span class="font-semibold uppercase">Resurser</span>
      <Link href="/pricing#faq" class={linkStyle}>Vanliga frågor</Link>
      <Link href="/contact-us" class={linkStyle}>Kontakta oss</Link>
      <Link href="/integrity-policy" class={linkStyle}>Integritetspolicy</Link>
      <Link href="/terms-and-conditions" class={linkStyle}>Användarvillkor</Link>
    </nav>
  </div>
</footer>
