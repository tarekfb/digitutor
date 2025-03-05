<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };
  export let nbrOfReviews: number;
</script>

<p class={cn("text-muted-foreground", className)}>
  {nbrOfReviews} recension{nbrOfReviews > 1 ? "er" : ""}
</p>
