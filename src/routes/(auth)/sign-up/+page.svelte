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
  import AuthSplit from "src/lib/components/molecules/auth-split.svelte";
  import type { PageData } from "./$types";
  import Stars from "src/lib/components/atoms/stars.svelte";

  export let data: PageData;
  $: ({ review } = data);

  const userForm = superForm(data.form, {
    validators: zodClient(signUpSchema),
  });
  const { form: formData, enhance, delayed, message, allErrors } = userForm;

  const role = $page.url.searchParams.get("role");
</script>

<svelte:head>
  <title>Skapa konto</title>
</svelte:head>

<AuthSplit condition={!!review}>
  <svelte:fragment slot="aside">
    <div class="relative flex flex-col gap-3">
      <div class="absolute select-none -top-32 -left-11 rotate-180">
        <span class="text-[160px] font-[helvetica] leading-none text-primary/40"
          >“</span
        >
      </div>
      <blockquote class="z-10 max-w-lg text-3xl">
        {review.description}
      </blockquote>
      <Stars rating={review.rating} />
      {#if review.sender}
        <div class="flex items-center gap-x-2 self-start mt-2.5">
          <Avatar
            url={review.sender.avatar_url ?? ""}
            firstName={review.sender.first_name}
            lastName={review.sender.last_name}
            role={review.sender.role}
            onClick={undefined}
            class="text-sm w-7 h-7"
          />
          <cite class="not-italic text-lg">
            {review.sender.first_name}
          </cite>
          <ArrowRightIcon class="w-4 h-4" />
          <a
            class="gap-x-2 flex items-center"
            href="/profile/{review.receiver.id}"
          >
            <Avatar
              url={review.receiver.avatar_url ?? ""}
              firstName={review.receiver.first_name}
              lastName={review.receiver.last_name}
              role={review.receiver.role}
              class="text-sm w-7 h-7"
              onClick={undefined}
            />
            <p class="text-lg">{review.receiver.first_name}</p>
          </a>
        </div>
      {/if}
    </div>
  </svelte:fragment>
  <svelte:fragment slot="form">
    <form
      class="text-start flex flex-col gap-y-4 w-full max-w-screen-sm p-4"
      method="POST"
      use:enhance
    >
      <Tabs.Root
        value={role ?? "student"}
        class="text-start flex flex-col gap-y-4"
      >
        <Tabs.List class="self-center">
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
        {delayed}
        {allErrors}
        text="Skapa konto"
        class="self-center min-w-wider"
      />
    </form>
  </svelte:fragment>
</AuthSplit>
