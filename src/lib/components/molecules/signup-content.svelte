<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Form from "$lib/components/ui/form/index.js";
  import Label from "$lib/components/atoms/label.svelte";
  import PasswordInput from "$lib/components/molecules/password-input.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import { Checkbox } from "$lib/components/ui/checkbox/index.ts";
  import type { signUpSchema } from "src/lib/shared/models/user.ts";
  import { type Infer, type SuperForm } from "sveltekit-superforms/client";

  export let type: "teacher" | "student";
  export let userForm: SuperForm<Infer<typeof signUpSchema>>;
  export let formData: SuperForm<Infer<typeof signUpSchema>>["form"];

  const getReadableType = (
    type: "teacher" | "student",
  ): "lärare" | "student" => (type === "teacher" ? "lärare" : "student");
</script>

<div class="mb-4 space-y-1 text-center lg:text-start">
  <PrimaryTitle class="whitespace-normal"
    >Skapa konto som {getReadableType(type)}</PrimaryTitle
  >
  <p class="text-muted-foreground">
    Ett konto är gratis och inget betalkort behövs. Har du redan ett konto?
    <a href="/sign-in" class="underline"> Logga in här. </a>
  </p>
</div>
<div class="flex flex-col gap-4">
  <Form.Field form={userForm} name="firstName">
    <Form.Control let:attrs>
      <Label>Förnamn</Label>
      <Input
        {...attrs}
        type="text"
        bind:value={$formData.firstName}
        placeholder="Förnamn"
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field form={userForm} name="lastName">
    <Form.Control let:attrs>
      <Label>Efternamn</Label>
      <Input
        {...attrs}
        type="text"
        bind:value={$formData.lastName}
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

  <Form.Field
    form={userForm}
    name="terms"
    class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
  >
    <Form.Control let:attrs>
      <Checkbox {...attrs} bind:checked={$formData.terms} />
      <Form.Label class="text-foreground"
        >Jag accepterar <a href="/terms-and-conditions" class="underline"
          >villkoren</a
        >
        och
        <a href="/integrity-policy" class="underline">integritetspolicyn</a
        >.</Form.Label
      >
      <input name={attrs.name} value={$formData.terms} hidden />
    </Form.Control>
  </Form.Field>
</div>
