<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import { superForm } from "sveltekit-superforms";
  import { Button } from "$lib/components/ui/button";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { signUpSchema } from "$lib/shared/models/user.js";
  import { Input } from "$lib/components/ui/input";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import * as RadioGroup from "$lib/components/ui/radio-group";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import Label from "$lib/components/atoms/label.svelte";
  import PasswordInput from "$lib/components/molecules/password-input.svelte";
  import { mediaQuery } from "svelte-legos";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import * as Tabs from "$lib/components/ui/tabs";

  export let data;

  const isDesktop = mediaQuery("(min-width: 768px)");
  const userForm = superForm(data.form, {
    validators: zodClient(signUpSchema),
  });
  const { form: formData, enhance, submitting, message, allErrors } = userForm;

  import { page } from "$app/stores";
  import Avatar from "src/lib/components/atoms/avatar.svelte";
  const role = $page.url.searchParams.get("role");
</script>

<svelte:head>
  <title>Skapa konto</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<!-- <span class="text-[160px]">،، ⸲⸲ ⹁⹁ ︐ ︐ ﹐﹐</span> -->

{#if $isDesktop}
  <div class="flex-1 flex justify-between">
    <div
      class="w-full self-center flex flex-col items-center justify-center p-20 relative"
    >
      <span
        class="absolute -top-12 left-10 tracking-[-0.02em] leading-none text-[160px] text-primary/35"
      >
        ،،
      </span>
      <blockquote class="z-10">{data.review.description}</blockquote>
      <span
        class="absolute top-18 right-10 mr-6 tracking-[-0.02em] leading-none text-[160px] text-primary/35"
      >
        ،،
      </span>
      <div class="flex gap-x-2 self-start mt-4">
        <Avatar
          profile={data.profile}
          onClick={undefined}
          class="text-sm w-7 h-7"
        />
        <SecondaryTitle class="text-muted-foreground text-md md:text-xl">
          {data.profile.first_name}
        </SecondaryTitle>
      </div>
    </div>
    <div class="w-full bg-white flex flex-col items-center justify-center p-4">
      <form class="text-start flex flex-col gap-y-4" method="POST" use:enhance>
        <Tabs.Root
          value={role ?? "student"}
          class="w-[400px] text-start flex flex-col gap-y-4"
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
          <Tabs.Content value="student">
            <div class="space-y-1 mb-4">
              <PrimaryTitle class="text-2xl"
                >Skapa konto som student</PrimaryTitle
              >
              <p class="text-muted-foreground">
                Har du redan ett konto? <a href="/sign-in" class="underline">
                  Logga in här.
                </a>
              </p>
            </div>
            <div class="flex flex-col gap-4">
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
              <input type="hidden" name="role" value="student" />
              <Form.Field
                form={userForm}
                name="terms"
                class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
              >
                <Form.Control let:attrs>
                  <Checkbox {...attrs} bind:checked={$formData.terms} />
                  <Form.Label class="text-foreground"
                    >Jag accepterar <a href="/terms" class="underline"
                      >villkoren</a
                    >
                    och
                    <a href="/privacy" class="underline">integritetspolicyn</a
                    >.</Form.Label
                  >
                  <input name={attrs.name} value={$formData.terms} hidden />
                </Form.Control>
              </Form.Field>
            </div>
          </Tabs.Content>
          <Tabs.Content value="teacher">
            <div class="space-y-1 mb-4">
              <PrimaryTitle class="text-2xl"
                >Skapa ett konto som lärare</PrimaryTitle
              >
              <p class="text-muted-foreground">
                Har du redan ett konto? <a href="/sign-in" class="underline">
                  Logga in här.
                </a>
              </p>
            </div>
            <div class="flex flex-col gap-4">
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
              <input type="hidden" name="role" value="teacher" />
              <Form.Field
                form={userForm}
                name="terms"
                class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
              >
                <Form.Control let:attrs>
                  <Checkbox {...attrs} bind:checked={$formData.terms} />
                  <Form.Label class="text-foreground"
                    >Jag accepterar <a href="/terms" class="underline"
                      >villkoren</a
                    >
                    och
                    <a href="/privacy" class="underline">integritetspolicyn</a
                    >.</Form.Label
                  >
                  <input name={attrs.name} value={$formData.terms} hidden />
                </Form.Control>
              </Form.Field>
            </div>
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
{:else}
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
    <!-- <Loader2 class="mr-2 h-4 w-4 animate-spin" /> -->
  </form>
{/if}

<style>
  /* @font-face {
    font-family: "YourFontName";
    src: url("/fonts/your-font.woff2") format("woff2");
    unicode-range: U+0022;
  } */
  .custom-font {
    font-family: "SpaceGrotesk", sans-serif;
  }
</style>
