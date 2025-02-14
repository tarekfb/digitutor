<script lang="ts">
  export let text: string;
  export let href: string;
</script>

<a
  {href}
  aria-label={text}
  class="h-42 w-full md:hover:scale-105 md:transition-all md:ease-in-out"
>
  <li
    class="flex h-full w-full items-center justify-center rounded-md border border-solid border-accent bg-card p-6 md:p-8"
  >
    <div
      class="flex flex-1 flex-col items-center justify-center gap-y-2 md:gap-y-4"
    >
      <div
        class="flex items-center justify-center rounded-sm bg-accent/10 p-2 md:p-3"
      >
        <slot />
      </div>
      <p class="text-bold text-muted-foreground md:text-lg">
        {text}
      </p>
    </div>
  </li>
</a>
