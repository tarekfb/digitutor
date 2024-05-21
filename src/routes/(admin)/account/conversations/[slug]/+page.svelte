<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
  import DeleteListing from "$lib/components/listing/delete-listing.svelte";
  import MissingListing from "$lib/components/listing/missing-listing.svelte";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { createListingSchema } from "$lib/models/listing";
  import DescriptionEditable from "src/lib/components/listing/description-editable.svelte";
  import TitleEditable from "src/lib/components/listing/title-editable.svelte";
  import SubjectsEditable from "src/lib/components/listing/subjects-editable.svelte";
  import HourlyPriceEditable from "src/lib/components/listing/hourly-price-editable.svelte";
  import NonEditableListing from "src/lib/components/listing/non-editable-listing.svelte";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import VisibilityEditable from "src/lib/components/listing/visibility-editable.svelte";
  import { SaveIcon, X, Pencil } from "lucide-svelte";
  import { convertToInitials } from "src/lib/utils.js";

  export let data;
  const { conversation } = data;
</script>

<h1>{conversation?.id}</h1>
<div class="flex flex-col gap-y-2"></div>
