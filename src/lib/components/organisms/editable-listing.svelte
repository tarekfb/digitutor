<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
  import DeleteListing from "src/lib/components/atoms/delete-listing.svelte";
  import { Button } from "$lib/components/ui/button";
  import DescriptionEditable from "src/lib/components/molecules/description-editable.svelte";
  import TitleEditable from "src/lib/components/molecules/title-editable.svelte";
  import SubjectsEditable from "src/lib/components/molecules/subjects-editable.svelte";
  import HourlyPriceEditable from "src/lib/components/molecules/hourly-price-editable.svelte";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";
  import VisibilityEditable from "src/lib/components/molecules/visibility-editable.svelte";
  import { SaveIcon, X } from "lucide-svelte";
  import FormMessage from "src/lib/components/molecules/form-message.svelte";

  export let formData;
  export let listingForm;
  export let allErrors;
  export let errors;
  export let message;
  export let submitting;
  export let enhance;
  export let stopEditing: () => void;
</script>

<div class="flex flex-col gap-y-4 m-8">
  <FormMessage {message} scroll />
  <form
    method="POST"
    use:enhance
    action="?/updateListing"
    class="flex flex-col gap-y-4 generic-card"
  >
    <TitleEditable {formData} {listingForm} />
    <HourlyPriceEditable {formData} {listingForm} />
    <Separator />
    <DescriptionEditable {formData} {listingForm} />
    <SubjectsEditable {formData} {errors} />
    <VisibilityEditable {formData} {listingForm} />

    <div class="flex justify-end gap-x-2">
      <Button on:click={stopEditing} variant="secondary">
        <X class="mr-2 h-5 w-5" />
        Avbryt
      </Button>
      <Button type="submit" disabled={$allErrors.length > 0 || $submitting}>
        {#if $submitting}
          <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
        {:else}
          <SaveIcon class="mr-2 h-5 w-5" />
          Spara
        {/if}
      </Button>
    </div>
    <div class="self-start">
      <DeleteListing />
    </div>
  </form>
</div>
