<script lang="ts">
  import { Clock, CircleAlert } from "lucide-svelte";
  import type { Conversation } from "src/lib/shared/models/conversation";
  import { timeAgo } from "$lib/utils";
  import type { Tables } from "src/supabase";

  export let conversation: Conversation;
  export let profile: Tables<"profiles">;

  const hasNewIncoming = (
    profile: Tables<"profiles">,
    conversation: Conversation,
  ) => {
    if (profile.role === "teacher" && !conversation.has_replied) return true;
    return false;
  };

  $: recipient =
    profile.role == "teacher" ? conversation.student : conversation.teacher;
</script>

<div
  class="card-generic bg-card p-6 rounded-lg {hasNewIncoming(
    profile,
    conversation,
  )
    ? 'border border-solid border-success'
    : ''} flex justify-between"
>
  <div class="flex flex-col gap-y-4">
    <h3 class="font-semibold text-lg">{recipient.first_name}</h3>
    {#if hasNewIncoming(profile, conversation)}
      <p class="">Ny förfrågan!</p>
    {/if}
    <div class="flex items-center text-muted-foreground">
      <Clock class="mr-1 h-3 w-3 " />
      {timeAgo(conversation.created_at)} sedan
    </div>
  </div>
  {#if hasNewIncoming(profile, conversation)}
    <div class="flex flex-col justify-center items-center">
      <CircleAlert class="h-10 w-10 text-success" />
    </div>
  {/if}
</div>
