<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { signInSchema } from "$lib/shared/models/user.js";
  import { Input } from "$lib/components/ui/input";
  import { Terminal } from "lucide-svelte";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import Label from "$lib/components/atoms/label.svelte";
  import { MessageId } from "$lib/shared/constants/constants";
  import PasswordInput from "$lib/components/molecules/password-input.svelte";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import AuthSplit from "src/lib/components/molecules/auth-split.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import type { PageData } from "./$types";
  import { languages } from "src/lib/shared/models/common";
  import type { ReviewWithReferences } from "src/lib/shared/models/review";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import ReviewCardExtra from "src/lib/components/molecules/review-card-extra.svelte";

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

<AuthSplit shouldShowAside={reviews.length > 0 && listings.length > 0 && subjects.length > 0}>
  <svelte:fragment slot="aside">
    <div class="flex justify-around gap-x-8">
      <div class="max-w-36 flex flex-col">
        {#if reviews[0].receiver.avatarUrl}
          <img
            alt="profile avatar"
            class="rounded-sm mb-2"
            width="250"
            height="250"
            src={reviews[0].receiver.avatarUrl}
          />
        {/if}
        <div
          class="flex flex-col gap-y-0.5 text-muted-foreground text-xl md:text-2xl"
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
                {#if i < 10 && languages[subject]?.label}
                  <li class="flex gap-x-2 items-center">
                    <Terminal class="w-5 h-5 text-accent" />
                    <p class="font-mono text-base">
                      {languages[subject].label}
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
          <PrimaryTitle class="font-normal max-w-[400px] overflow-hidden"
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
    <form
      class="text-start flex flex-col gap-y-4 w-full max-w-screen-sm p-4"
      action="?/signIn"
      method="POST"
      use:enhance
    >
      <div class="flex flex-col gap-y-2 mb-4 text-center lg:text-start">
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
          class="underline text-muted-foreground text-sm justify-self-center text-center lg:text-start"
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
        class="self-center min-w-wider"
      />
    </form>
  </svelte:fragment>
</AuthSplit>
<!-- 
<style lang="css">
  .transp-background {
    /* background-color: hsla(222.2, 84%, 4.9%, 0.5); */
    background-color: hsla(0, 0%, 100%, 0.5);
    --card: 0 0% 100%;
    /* i broke the transparancy somehow... */
  }
</style> -->
