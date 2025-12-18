<script lang="ts">
  import type { ListingWithProfile } from "src/lib/shared/models/listing.ts";
  import { Button } from "$lib/components/ui/button/index.js";
  import OwnerSection from "./owner-section.svelte";
  import * as Drawer from "$lib/components/ui/drawer/index.js";

  export let listing: ListingWithProfile | undefined = undefined;
</script>

<Drawer.Root>
  <Drawer.Trigger class="mt-4 md:mb-8 md:mt-0"
    ><Button class="wide-button" variant="outline-card">Inställningar</Button
    ></Drawer.Trigger
  >
  <Drawer.Content>
    <div class="mx-auto mt-0 h-2 w-[100px] rounded-full bg-black/10"></div>
    <Drawer.Header>
      <Drawer.Title>Inställningar</Drawer.Title>
      <Drawer.Description>
        <OwnerSection {listing} />
      </Drawer.Description>
    </Drawer.Header>
  </Drawer.Content>
</Drawer.Root>
