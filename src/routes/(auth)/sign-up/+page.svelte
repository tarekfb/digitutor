<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { signUpSchema } from "$lib/shared/models/user.js";
  import * as Tabs from "$lib/components/ui/tabs";
  import { page } from "$app/stores";
  import Avatar from "src/lib/components/atoms/avatar.svelte";
  import { ArrowRightIcon } from "lucide-svelte";
  import SignupContent from "src/lib/components/molecules/signup-content.svelte";
  import FormMessage from "src/lib/components/molecules/form-message.svelte";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import { Star } from "lucide-svelte";

  export let data;
  $: ({ profile, review } = data);

  const userForm = superForm(data.form, {
    validators: zodClient(signUpSchema),
  });
  const { form: formData, enhance, submitting, message, allErrors } = userForm;

  const role = $page.url.searchParams.get("role");
</script>

<svelte:head>
  <title>Skapa konto</title>
</svelte:head>

<div class="w-full flex-1 grid md:grid-cols-2">
  <aside
    class="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 md:flex"
  >
    <div class="relative flex flex-col gap-3">
      <div class="absolute select-none -top-12 -left-11">
        <span class="text-[160px] font-[helvetica] leading-none text-primary/40"
          >“</span
        >
      </div>
      <blockquote class="z-10 max-w-lg text-3xl">
        {review.description}
      </blockquote>
      <div class="flex gap-x-0.5">
        {#each [...Array(5)] as _}
          <Star class="fill-yellow-300 text-yellow-400 w-7 h-7" />
        {/each}
      </div>
      <div class="flex items-center gap-x-2 self-start mt-2.5">
        <Avatar {profile} onClick={undefined} class="text-sm w-7 h-7" />
        <cite class="not-italic text-md md:text-lg">
          {profile.first_name}
        </cite>
        <ArrowRightIcon class="w-4 h-4" />
        <a
          class="gap-x-2 flex items-center"
          href="/profile/{review.receiver.id}"
        >
          <Avatar
            profile={review.receiver}
            class="text-sm w-7 h-7"
            onClick={undefined}
          />
          <p class="text-md md:text-lg">{review.receiver.first_name}</p>
        </a>
      </div>
    </div>
  </aside>
  <div
    class="bg-white flex flex-col items-center md:justify-center p-4 col-span-2 md:col-span-1"
  >
    <form class="text-start flex flex-col gap-y-4" method="POST" use:enhance>
      <Tabs.Root
        value={role ?? "student"}
        class="md:w-[350px] text-start flex flex-col gap-y-4"
      >
        <Tabs.List class=" self-center">
          <Tabs.Trigger
            value="student"
            class="data-[state=active]:bg-primary data-[state=inactive]:bg-secondary data-[state=inactive]:text-black data-[state=active]:text-red-300"
            >Student</Tabs.Trigger
          >
          <Tabs.Trigger
            value="teacher"
            class="data-[state=active]:bg-primary data-[state=inactive]:bg-secondary data-[state=inactive]:text-black data-[state=active]:text-red-300"
            >Lärare</Tabs.Trigger
          >
        </Tabs.List>
        <Tabs.Content value="student" class="">
          <SignupContent type="student" {formData} {userForm} />
        </Tabs.Content>
        <Tabs.Content value="teacher">
          <SignupContent type="teacher" {formData} {userForm} />
        </Tabs.Content>
      </Tabs.Root>
      <FormMessage {message} scroll scrollTo="start" />
      <FormSubmit
        {submitting}
        {allErrors}
        text="Skapa konto"
        class="self-center"
      />
    </form>
  </div>
</div>
