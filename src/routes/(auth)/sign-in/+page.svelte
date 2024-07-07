<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { signInSchema } from "$lib/shared/models/user.js";
  import { Input } from "$lib/components/ui/input";

  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import Label from "$lib/components/atoms/label.svelte";
  import { MessageId } from "$lib/shared/constants/constants";
  import PasswordInput from "$lib/components/molecules/password-input.svelte";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import AuthSplit from "src/lib/components/molecules/auth-split.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import type { PageData } from "./$types";
  import { Subjects } from "src/lib/shared/models/common";
  import type { Review } from "src/lib/shared/models/review";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import ReviewCardExtra from "src/lib/components/molecules/review-card-extra.svelte";

  export let data: PageData;

  $: ({ reviews, listings, subjects } = data);

  $: avgRating = getAvgRating(reviews);

  const getAvgRating = (reviews: Review[]) => {
    if (reviews.length === 0) return undefined;
    let sum = 0;
    reviews?.forEach((review) => {
      sum += review.rating;
    });
    return sum / reviews.length;
  };

  const userForm = superForm(data.form, {
    validators: zodClient(signInSchema),
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
    resetForm: false,
  });
  const { form: formData, enhance, submitting, message, allErrors } = userForm;
</script>

<svelte:head>
  <title>Logga in</title>
</svelte:head>

<AuthSplit>
  <svelte:fragment slot="aside">
    <div class="grid grid-cols-6 gap-x-8">
      <div class="col-span-2">
        <img
          alt="profile avatar"
          class="rounded-lg"
          width="125"
          height="125"
          src="./images/pp.jpeg"
        />
        <div
          class="flex flex-col gap-y-0.5 text-muted-foreground text-xl md:text-2xl"
        >
          <SecondaryTitle class=" font-semibold"
            >{reviews[0].receiver.first_name}</SecondaryTitle
          >
          {#if avgRating !== undefined}
            <Stars size={5} rating={avgRating} />
          {/if}
          <div>
            {#each subjects as subject, i}
              <span
                >{Subjects[subject]}{i < subjects.length - 1 ? ", " : ""}</span
              >
            {/each}
          </div>
        </div>
      </div>
      <!-- opacity-{100 - i * 40}  -->
      <!-- z-{(reviews.length - index) * 10} -->
      <div class="col-start-3 col-span-4 flex flex-col items-center">
        {#if listings?.at(0)}
          <PrimaryTitle class="font-normal">{listings[0].title}</PrimaryTitle>
        {/if}
        <div class="mt-6 flex flex-col gap-y-1">
          {#each reviews as review, index}
            <div
              class="z-{(reviews.length - index) * 10 + 20} transp-background"
            >
              <ReviewCardExtra {review} />
            </div>
          {/each}
          <!-- <div class="z-50">
            <ReviewCardExtra review={reviews[0]} />
          </div>
          <div class="z-40 transp-background">
            <ReviewCardExtra review={reviews[1]} />
          </div>
          <div class="z-30 transp-background">
            <ReviewCardExtra review={reviews[2]} />
          </div> -->
        </div>
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="form">
    <form
      class="text-start flex flex-col gap-y-4"
      action="?/signIn"
      method="POST"
      use:enhance
    >
      <FormMessage {message} scroll>
        {#if $message.id === MessageId.RateLimitExceeded}
          <p class="mt-2">
            Försökte skicka bekräftelsemail men misslyckades p.g.a. för många
            e-postutskick.
          </p>
          <p>Försök igen lite senare.</p>
        {/if}
      </FormMessage>
      <div class="space-y-1 mb-4">
        <PrimaryTitle class="text-2xl">Logga in</PrimaryTitle>
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
          class="underline text-muted-foreground text-sm justify-self-center"
          >Glömt lösen?</a
        >
      </div>
      <FormSubmit
        {submitting}
        {allErrors}
        text="Skapa konto"
        class="self-center"
      />
    </form>
  </svelte:fragment>
</AuthSplit>

<style lang="css">
  .transp-background {
    background-color: hsla(222.2, 84%, 4.9%, 0.5);
    /* i broke the transparancy somehow... */
  }
</style>
