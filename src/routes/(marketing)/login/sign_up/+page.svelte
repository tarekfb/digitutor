<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte";
  import { sharedAppearance } from "../login_config";
  import * as Tabs from "$lib/components/ui/tabs";
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import * as Alert from "$lib/components/ui/alert";
  // import { registerSchema } from "$lib/models/profile";
  import type { SuperValidated } from "sveltekit-superforms";
  import { Loader2 } from "lucide-svelte";
  import { AlertCircle } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";

  export let data;
  // gör superforms
  // skapa schema som ha detalkjer för user, och om det behövs från profile också
  // sen gör en vanlig formsubmit med superforms
  // där inne kör man koden härifrån
  // https://github.com/supabase-community/supabase-ui-svelte/blob/main/src/EmailAuthView.svelte
  // i submit
  // och sen efter det länkar man ihop den till en ny profil som man skapar i db
</script>

<svelte:head>
  <title>Skapa konto</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Skapa konto</h1>
<Tabs.Root value="student" class="w-80">
  <Tabs.List class="bg-card">
    <Tabs.Trigger value="student">Elev</Tabs.Trigger>
    <Tabs.Trigger value="teacher">Lärare</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="student" class="bg-card p-4 rounded-lg">
    <!-- <Auth
      supabaseClient={data.supabase}
      view="sign_up"
      redirectTo={`${data.url}/auth/callback`}
      showLinks={false}
      socialLayout="horizontal"
      appearance={sharedAppearance}
      additionalData={undefined}
    />
    <div class="text-l mt-4 mb-2">
      Har du redan ett konto? <a class="underline" href="/login/sign_in"
      >Logga in</a
      >.
    </div> -->
    <!-- providers={oauthProviders} -->
    <form class="flex items-center justify-center mx-auto max-w-2xl"></form>
  </Tabs.Content>
  <Tabs.Content value="teacher">Change your password here.</Tabs.Content>
</Tabs.Root>
