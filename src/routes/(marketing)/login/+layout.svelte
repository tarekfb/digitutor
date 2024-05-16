<script lang="ts">
  let isEurope = false;
  try {
    isEurope = Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone.startsWith("Europe/");
  } catch {
    /* continue */
  }
</script>

<div
  class="text-center max-w-lg py-12 flex flex-col items-center justify-center gap-y-4"
>
  <slot />
  <div class="mt-8 {isEurope ? 'block' : 'hidden'}">
    🍪 Inloggning använder kakor 🍪
  </div>
</div>
