<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { signUpSchema } from "$lib/shared/models/user.js";
  import * as Tabs from "$lib/components/ui/tabs/index.ts";
  import { page } from "$app/stores";
  import Avatar from "src/lib/components/atoms/avatar.svelte";
  import ArrowRightIcon from "lucide-svelte/icons/arrow-right";
  import SignupContent from "src/lib/components/molecules/signup-content.svelte";
  import FormMessage from "src/lib/components/molecules/form-message.svelte";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import AuthSplit from "src/lib/components/molecules/auth-split.svelte";
  import type { PageData } from "./$types.ts";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Form from "$lib/components/ui/form/index.js";

  export let data: PageData;
  $: ({ review } = data);

  const userForm = superForm(data.form, {
    validators: zodClient(signUpSchema),
  });
  const { form: formData, enhance, delayed, message, allErrors } = userForm;

  $formData.role =
    $page.url.searchParams.get("role") === "teacher" ? "teacher" : "student";
</script>

<svelte:head>
  <title>Skapa konto</title>
</svelte:head>

<AuthSplit shouldShowAside={!!review}>
  <svelte:fragment slot="aside">
    <!-- this if block is only to please svelte compiler, the shouldShowAside condition already handles this logic -->
    {#if review}
      <div class="relative flex flex-col gap-3">
        <div class="absolute -left-11 -top-32 rotate-180 select-none">
          <span
            class="font-[helvetica] text-[160px] leading-none text-primary/40"
            >“</span
          >
        </div>
        <blockquote class="z-10 max-w-lg text-3xl">
          {review.description}
        </blockquote>
        <Stars rating={review.rating} />
        {#if review.sender}
          <div class="mt-2.5 flex items-center gap-x-2 self-start">
            <Avatar
              url={review.sender.avatarUrl ?? ""}
              firstName={review.sender.firstName}
              role={review.sender.role}
              class="h-7 w-7 text-sm"
            />
            <cite class="text-lg not-italic">
              {review.sender.firstName}
            </cite>
            <ArrowRightIcon class="size-4" />
            <a
              class="flex items-center gap-x-2"
              href="/profile/{review.receiver.id}"
            >
              <Avatar
                url={review.receiver.avatarUrl ?? ""}
                firstName={review.receiver.firstName}
                role={review.receiver.role}
                class="h-7 w-7 text-sm"
              />
              <p class="text-lg">{review.receiver.firstName}</p>
            </a>
          </div>
        {/if}
      </div>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="form">
    <form
      class="flex w-full max-w-screen-sm flex-col gap-y-4 p-4 text-start"
      action="?/signUp"
      method="POST"
      use:enhance
    >
      <Tabs.Root
        class="flex flex-col gap-y-4 text-start"
        bind:value={$formData.role}
      >
        <Tabs.List class="self-center">
          <Tabs.Trigger
            value="student"
            class="data-[state=active]:bg-primary data-[state=inactive]:bg-none data-[state=active]:text-red-300 data-[state=inactive]:text-black"
            >Student</Tabs.Trigger
          >
          <Tabs.Trigger
            value="teacher"
            class="data-[state=active]:bg-primary data-[state=inactive]:bg-none data-[state=active]:text-red-300 data-[state=inactive]:text-black"
            >Lärare</Tabs.Trigger
          >
        </Tabs.List>
        <Tabs.Content value="student">
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
        class="min-w-wider self-center"
      />
      <Form.Field form={userForm} name="role" class="hidden">
        <Form.Control let:attrs>
          <Input
            type="hidden"
            {...attrs}
            class="hidden"
            bind:value={$formData.role}
          />
        </Form.Control>
      </Form.Field>
    </form>
  </svelte:fragment>
</AuthSplit>
