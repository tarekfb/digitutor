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

<div class="text-center max-w-lg py-12 flex items-center justify-center">
  <div class="flex flex-col">
    <slot />
    <div class="mt-8 {isEurope ? 'block' : 'hidden'}">
      🍪 Inloggning använder kakor 🍪
    </div>
  </div>
</div>
