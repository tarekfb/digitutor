<script lang="ts">
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { updateListingSchema } from "$lib/shared/models/listing.js";
  import EditableListing from "$lib/components/organisms/editable-listing.svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import type { PageData } from "./$types";
  import RootContainer from "src/lib/components/molecules/root-container.svelte";

  export let data: PageData;
  // $: ({ profile, listing, requestContactForm, startContactForm, reviews } =
  //   data);

  let isEditing = false;

  const listingForm = superForm(data.updateListingForm, {
    validators: zodClient(updateListingSchema),
    onUpdated({ form }) {
      if (form.valid) {
        isEditing = false;
        reset({ newState: data.updateListingForm.data });
      }
    },
    resetForm: false,
  });

  const { reset } = listingForm;
</script>

<PrimaryTitle class="text-center">Redigera annons</PrimaryTitle>
<RootContainer class="w-full">
  <EditableListing {listingForm} stopEditing={() => (isEditing = false)} />
</RootContainer>
