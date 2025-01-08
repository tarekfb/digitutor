<script lang="ts">
  export let shouldShowAside: boolean;
  const cols = shouldShowAside
    ? "col-span-2 lg:col-start-5 lg:col-span-2"
    : "col-span-6 lg:col-start-1";
</script>

<div class="grid w-full flex-1 lg:grid-cols-6">
  {#if shouldShowAside}
    <aside
      class="hidden flex-1 flex-shrink basis-1/4 flex-col items-center justify-center lg:col-span-4 lg:flex"
    >
      <slot name="aside" />
    </aside>
  {/if}
  <main
    class="flex flex-col items-center bg-white p-4 lg:justify-center {cols}"
  >
    <slot name="form" />
  </main>
</div>
