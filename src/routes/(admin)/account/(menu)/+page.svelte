<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import { initCreateListingSchema } from "src/lib/shared/models/listing.js";
  import AccountHomeStudent from "src/lib/components/organisms/account-home-student.svelte";
  import { superForm, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import AccountHomeTeacher from "src/lib/components/organisms/account-home-teacher.svelte";

  let adminSection: Writable<string> = getContext("adminSection");
  adminSection.set("dashboard");

  export let data;
  $: ({ listings, conversations, profile } = data);

  const form = data.form as SuperValidated<
    {
      title: string;
    },
    any,
    {
      title: string;
    }
  >;
  // this is complaining about potential undefined. Maybe there's an issue with parent serving data?
  // anyway, proceeding with this dirty hack...

  const userForm = superForm(form, {
    validators: zodClient(initCreateListingSchema),
  });
</script>

<svelte:head>
  <title>Konto</title>
</svelte:head>
<!-- need to add hasaccepted as bool field to db conversations -->

{#if profile?.role === "teacher"}
  <AccountHomeTeacher {conversations} {listings} {userForm} {profile} />
{:else if profile?.role === "student"}
  <AccountHomeStudent {conversations} {profile} />
{/if}
