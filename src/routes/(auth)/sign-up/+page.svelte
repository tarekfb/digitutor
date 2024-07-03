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
          <Star
            class="fill-yellow-300 text-yellow-400 w-7 h-7"
          />
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
<!-- {:else}
  <FormMessage {message} scroll scrollTo="end" />
  <form class="text-start" method="POST" use:enhance>
    <Card.Root>
      <Card.Header class="space-y-1">
        <Card.Title class="text-2xl">Skapa ett konto</Card.Title>
        <Card.Description
          >Har du redan ett konto? <a href="/sign-in" class="underline"
            >Logga in här.</a
          ></Card.Description
        >
      </Card.Header>
      <Card.Content class="grid gap-4">
        <Form.Field form={userForm} name="first_name">
          <Form.Control let:attrs>
            <Label>Förnamn</Label>
            <Input
              {...attrs}
              type="text"
              bind:value={$formData.first_name}
              placeholder="Förnamn"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field form={userForm} name="last_name">
          <Form.Control let:attrs>
            <Label>Efternamn</Label>
            <Input
              {...attrs}
              type="text"
              bind:value={$formData.last_name}
              placeholder="Efternamn"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
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
        <Form.Fieldset form={userForm} name="role" class="space-y-3">
          <Form.Legend>Jag vill registrera mig som...</Form.Legend>
          <RadioGroup.Root
            bind:value={$formData.role}
            class="flex flex-col space-y-1"
          >
            <div class="flex items-center space-x-3 space-y-0">
              <Form.Control let:attrs>
                <RadioGroup.Item value="student" {...attrs} />
                <Form.Label class="font-normal">Student</Form.Label>
              </Form.Control>
            </div>
            <div class="flex items-center space-x-3 space-y-0">
              <Form.Control let:attrs>
                <RadioGroup.Item value="teacher" {...attrs} />
                <Form.Label class="font-normal">Lärare</Form.Label>
              </Form.Control>
            </div>
            <RadioGroup.Input name="role" />
          </RadioGroup.Root>
          <Form.FieldErrors />
        </Form.Fieldset>
        <Form.Field
          form={userForm}
          name="terms"
          class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
        >
          <Form.Control let:attrs>
            <Checkbox {...attrs} bind:checked={$formData.terms} />
            <Form.Label class="text-foreground"
              >Jag accepterar <a href="/terms" class="underline">villkoren</a>
              och
              <a href="/privacy" class="underline">integritetspolicyn</a
              >.</Form.Label
            >
            <input name={attrs.name} value={$formData.terms} hidden />
          </Form.Control>
        </Form.Field>
      </Card.Content>
      <Card.Footer class="justify-center">
        <Button type="submit" disabled={$allErrors.length > 0 || $submitting}>
          {#if $submitting}
            <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
          {:else}
            Skapa konto
          {/if}
        </Button>
      </Card.Footer>
    </Card.Root>
  </form>
  {/if} -->
<!-- <Loader2 class="mr-2 h-4 w-4 animate-spin" /> -->
