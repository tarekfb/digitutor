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
  <PrimaryTitle testId={type}
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
        class="bg-card"
        placeholder="Förnamn"
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

  <Form.Field
    form={userForm}
    name="terms"
    class="flex flex-row items-center  space-y-0 rounded-md"
  >
    <Form.Control let:attrs>
      <Checkbox {...attrs} bind:checked={$formData.terms} class="bg-card" />
      <Form.Label class="px-2 text-foreground cursor-pointer"
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
