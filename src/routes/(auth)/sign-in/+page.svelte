<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { signInSchema } from "$lib/shared/models/user.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import CheckCircle2 from "lucide-svelte/icons/check-circle-2";
  import Terminal from "lucide-svelte/icons/terminal";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import Label from "$lib/components/atoms/label.svelte";
  import { MessageId } from "$lib/shared/constants/constants.ts";
  import PasswordInput from "$lib/components/molecules/password-input.svelte";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import AuthSplit from "src/lib/components/molecules/auth-split.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import type { PageData } from "./$types.ts";
  import { languages } from "src/lib/shared/models/common.ts";
  import type { ReviewWithReferences } from "src/lib/shared/models/review.ts";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import ReviewCardExtra from "src/lib/components/molecules/review-card-extra.svelte";
  import { page } from "$app/stores";

  export let data: PageData;

  $: ({ reviews, listings, subjects } = data);

  $: avgRating = getAvgRating(reviews);

  const getAvgRating = (
    reviews: ReviewWithReferences[],
  ): number | undefined => {
    if (reviews.length === 0) return undefined;
    let sum = 0;
    reviews?.forEach((review) => {
      sum += review.rating;
    });
    return sum / reviews.length;
  };

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
  shouldShowAside={reviews.length > 0 &&
    listings.length > 0 &&
    subjects.length > 0}
>
  <svelte:fragment slot="aside">
    <div class="flex justify-around gap-x-8">
      <div class="flex max-w-36 flex-col">
        {#if reviews[0].receiver.avatarUrl}
          <img
            alt="profile avatar"
            class="mb-2 rounded-sm"
            width="250"
            height="250"
            src={reviews[0].receiver.avatarUrl}
          />
        {/if}
        <div
          class="flex flex-col gap-y-0.5 text-xl text-muted-foreground md:text-2xl"
        >
          <SecondaryTitle class="whitespace-normal font-semibold"
            >{reviews[0].receiver.firstName}</SecondaryTitle
          >
          {#if avgRating !== undefined}
            <Stars size={5} rating={avgRating} />
          {/if}
          {#if subjects}
            <ul>
              {#each subjects as subject, i}
                {#if i < 10 && languages[subject - 1]?.title}
                  <li class="flex items-center gap-x-2">
                    <Terminal class="h-5 w-5 text-accent" />
                    <p class="font-mono text-base">
                      {languages[subject - 1].title}
                    </p>
                  </li>
                {/if}
              {/each}
            </ul>
          {/if}
        </div>
      </div>
      <div class="flex flex-col items-center">
        {#if listings?.at(0)}
          <PrimaryTitle
            class="max-w-[400px] overflow-x-hidden overflow-y-hidden overflow-ellipsis font-normal"
            >{listings[0].title}</PrimaryTitle
          >
        {/if}
        <div class="mt-6 flex flex-col gap-y-2">
          {#each reviews as review, index}
            <ReviewCardExtra
              {review}
              class="z-{(reviews.length - index) * 10 + 20} {getBlur(index)}"
            />
            <!-- + 20 because didnt work without it, will always work on 3 items but might act up on >3 -->
          {/each}
        </div>
      </div>
    </div>
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
              bind:value={$formData.email}
              placeholder="E-postadress"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field form={userForm} name="password">
          <Form.Control let:attrs>
            <Label>Lösenord</Label>
            <PasswordInput {formData} {attrs} />
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
          <p class="mt-2">
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
        class="min-w-wider self-center"
      />
    </form>
  </svelte:fragment>
</AuthSplit>
