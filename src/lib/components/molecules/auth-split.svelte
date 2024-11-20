<script lang="ts">
  export let shouldShowAside: boolean;
  const cols = shouldShowAside
    ? "col-span-2 lg:col-start-5 lg:col-span-2"
    : "col-span-6 lg:col-start-1";
</script>

<div class="w-full flex-1 grid lg:grid-cols-6">
  {#if shouldShowAside}
    <aside
      class="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 lg:flex lg:col-span-4"
    >
      <slot name="aside" />
    </aside>
  {/if}
  <main
    class="bg-white flex flex-col items-center lg:justify-center p-4 {cols}"
  >
    <slot name="form" />
  </main>
</div>
