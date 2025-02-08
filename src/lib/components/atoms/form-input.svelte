<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  import * as Form from "$lib/components/ui/form/index.js";
  import type { SuperForm } from "sveltekit-superforms/client";
  import { Input } from "$lib/components/ui/input/index.ts";

  export let name: string;
  export let form: SuperForm<any>;
  export let type: "text" | "email";
  export let placeholder: string = "";
  export let value: string;
  export let label: string;
  export let labelHidden: boolean = false;

  let className: string | null | undefined = undefined;
  export { className as class };
</script>

<Form.Field {form} {name}>
  <Form.Control let:attrs>
    <Form.Label class={labelHidden ? "sr-only" : ""}>{label}</Form.Label>
    <Input {...attrs} class={cn(className)} {type} bind:value {placeholder} />
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
<!-- currently not used, something is funky with binding of prop value. i think -->
