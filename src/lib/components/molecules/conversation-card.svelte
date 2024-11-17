<script lang="ts">
  import { Clock, CircleAlert } from "lucide-svelte";
  import type { Conversation } from "src/lib/shared/models/conversation";
  import { timeAgo } from "src/lib/shared/utils/utils";
  import type { Tables } from "src/supabase";

  export let conversation: Conversation;
  export let profile: Tables<"profiles">;

  const isNewRequest = (
    profile: Tables<"profiles">,
    conversation: Conversation,
  ) => (profile.role === "teacher" && !conversation.has_replied ? true : false);

  $: recipient =
    profile.role == "teacher" ? conversation.student : conversation.teacher;
</script>

<div
  class="card-generic bg-card p-6 rounded-sm {isNewRequest(
    profile,
    conversation,
  )
    ? 'border border-solid border-success'
    : ''} flex justify-between"
>
  <div class="flex flex-col gap-y-4 text-start">
    <h3 class="font-semibold text-lg">{recipient.first_name}</h3>
    {#if isNewRequest(profile, conversation)}
      <p>Ny förfrågan!</p>
    {/if}
    <div class="flex items-center text-muted-foreground">
      <Clock class="mr-1 h-3 w-3 " />
      {timeAgo(conversation.created_at)} sedan
    </div>
  </div>
  {#if isNewRequest(profile, conversation)}
    <div class="flex flex-col justify-center items-center">
      <CircleAlert class="h-10 w-10 text-success" />
    </div>
  {/if}
</div>
