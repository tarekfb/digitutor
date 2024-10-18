<script lang="ts">
  export let text: string;
  export let href: string;
</script>

<a {href} aria-label="Gå till din profil" class="h-42 w-full">
  <li
    class="flex justify-center items-center p-6 md:p-8 border border-solid border-accent rounded-md bg-card h-full w-full"
  >
    <div
      class="flex flex-col flex-1 gap-y-2 md:gap-y-4 justify-center items-center"
    >
      <div
        class="p-2 md:p-3 rounded-sm bg-accent/10 flex justify-center items-center"
      >
        <slot />
      </div>
      <p class="text-muted-foreground text-bold md:text-lg">
        {text}
      </p>
    </div>
  </li>
</a>
