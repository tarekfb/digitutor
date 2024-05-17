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
  class="text-center py-12 px-8 flex flex-col items-center justify-center gap-y-4 max-w-sm md:max-w-xl"
>
  <slot />
  <div class="mt-8 {isEurope ? 'block' : 'hidden'}">
    🍪 Inloggning använder kakor 🍪
  </div>
</div>
