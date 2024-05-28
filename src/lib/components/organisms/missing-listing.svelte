<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
</script>

<h1 class="text-3xl">Ojdå... Här var det tomt</h1>
<h1 class="text-xl">
  Den här annonsen finns inte längre. Vill du gå hem istället?
</h1>
<Button on:click={() => goto("/")}>Gå hem</Button>
