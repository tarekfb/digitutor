<script lang="ts">
  export let nbrOfReviews: number;
</script>

<p class="text-muted-foreground">
  {nbrOfReviews} recension{nbrOfReviews > 1 ? "er" : ""}
</p>
