<script>
  import "src/app.css";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
</script>

<div class="hero min-h-[100vh]">
  <div class="hero-content text-center">
    <div class="max-w-lg">
      <h1 class="text-5xl font-bold">Det här va lite pinsamt...</h1>
      <p class="py-6 text-2xl">Något gick fel: {$page?.error?.message}</p>
      <Button on:click={() => goto("/")}>Gå hem</Button>
    </div>
  </div>
</div>
