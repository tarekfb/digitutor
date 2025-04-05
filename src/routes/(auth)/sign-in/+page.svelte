<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { signInSchema } from "$lib/shared/models/user.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import Label from "$lib/components/atoms/label.svelte";
  import { MessageId } from "$lib/shared/constants/constants.ts";
  import PasswordInput from "$lib/components/molecules/password-input.svelte";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import AuthSplit from "src/lib/components/molecules/auth-split.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import type { PageData } from "./$types.ts";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import ReviewCardExtra from "src/lib/components/molecules/auth-review-card.svelte";
  import { page } from "$app/stores";
  import SubjectItem from "src/lib/components/atoms/subject-item.svelte";
  import Avatar from "src/lib/components/atoms/avatar.svelte";
  import SeeMore from "src/lib/components/molecules/see-more.svelte";

  export let data: PageData;

  $: ({ displayTeacher } = data);

  const getBlur = (i: number): "blur-sm" | "blur-md" | "" => {
    switch (i) {
      case 0:
        return "";
      case 1:
        return "blur-sm";
      case 2:
        return "blur-md";
      default:
        return "";
    }
  };

  const userForm = superForm(data.form, {
    validators: zodClient(signInSchema),
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
    resetForm: false,
  });
  const { form: formData, enhance, delayed, message, allErrors } = userForm;
</script>

<svelte:head>
  <title>Logga in</title>
</svelte:head>

<AuthSplit
  shouldShowAside={!!displayTeacher && displayTeacher.reviews.length > 0}
>
  <svelte:fragment slot="aside">
    <!-- this if is here only to please explain to ts displayteacher is not undefined -->
    {#if displayTeacher}
      {@const reviews = displayTeacher.reviews.splice(0, 3)}
      <div class="flex max-h-[75vh] flex-col gap-y-4">
        <PrimaryTitle class="text-muted-foreground"
          >Spana in en av våra lärare</PrimaryTitle
        >
        <div class="flex justify-around gap-x-8">
          <div class="flex max-w-36 flex-col">
            {#if displayTeacher.avatarUrl}
              <a href="/profile/{displayTeacher.id}">
                <img
                  alt="profile avatar"
                  class="mb-2 rounded-sm"
                  width="250"
                  height="250"
                  src={displayTeacher.avatarUrl}
                />
              </a>
            {/if}
            <div class="flex flex-col gap-y-2 text-muted-foreground">
              {#if displayTeacher.avatarUrl}
                <SecondaryTitle class="font-semibold"
                  >{displayTeacher.firstName}</SecondaryTitle
                >
              {:else}
                <div class="flex items-center gap-x-2">
                  <Avatar
                    firstName={displayTeacher.firstName}
                    role="teacher"
                    class="size-8 text-sm"
                    href="/profile/{displayTeacher.id}"
                    url={displayTeacher.avatarUrl ?? ""}
                  />
                  <SecondaryTitle class="font-semibold"
                    >{displayTeacher.firstName}</SecondaryTitle
                  >
                </div>
              {/if}
              <Stars size={5} rating={displayTeacher.avgRating} />
              <SeeMore subjects={displayTeacher.subjects} max={5} showUpToMax />
            </div>
          </div>
          <ul class="flex list-outside flex-col gap-y-2">
            {#each reviews as review, index}
              <ReviewCardExtra
                showAvatar={false}
                truncate={40}
                {index}
                {review}
                li
                class="z-{(reviews.length - index) * 10} {getBlur(
                  index,
                )} w-96 border bg-background shadow-md"
              />
            {/each}
          </ul>
        </div>
      </div>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="form">
    {@const next = $page.url.searchParams.get("next")}
    <form
      class="flex w-full max-w-screen-sm flex-col gap-y-4 p-4 text-start"
      action="?/signIn{next ? `&next=${next}` : ''}"
      method="POST"
      use:enhance
    >
      <div class="mb-4 flex flex-col gap-y-2 text-center lg:text-start">
        <PrimaryTitle>Logga in</PrimaryTitle>
        <p class="text-muted-foreground">
          Har du inget konto?
          <a href="/sign-up" class="underline">Skapa konto här.</a>
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <Form.Field form={userForm} name="email">
          <Form.Control let:attrs>
            <Label>E-postadress</Label>
            <Input
              {...attrs}
              type="email"
              class="bg-card"
              bind:value={$formData.email}
              placeholder="E-postadress"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field form={userForm} name="password">
          <Form.Control let:attrs>
            <Label>Lösenord</Label>
            <PasswordInput bgStyling="bg-card" {formData} {attrs} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <a
          href="/forgot-password"
          class="justify-self-center text-center text-sm text-muted-foreground underline lg:text-start"
          >Glömt lösen?</a
        >
      </div>
      <FormMessage {message} scroll>
        {#if $message.id === MessageId.RateLimitExceeded}
          <p class="mt-2 text-sm">
            Försökte skicka bekräftelsemail men misslyckades p.g.a. för många
            e-postutskick.
          </p>
          <p>Försök igen lite senare.</p>
        {/if}
      </FormMessage>
      <FormSubmit
        {delayed}
        {allErrors}
        text="Logga in"
        class="wide-button self-center"
      />
    </form>
  </svelte:fragment>
</AuthSplit>
