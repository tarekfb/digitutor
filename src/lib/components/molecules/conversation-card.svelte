<script lang="ts">
  import { Clock } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import type { Conversation } from "src/lib/shared/models/conversations";
  import { timeAgo } from "src/lib/utils";

  export let conversation: Conversation;
  export let profile;

  $: recipient =
    profile.role == "teacher" ? conversation.student : conversation.teacher;
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>{recipient.first_name}</Card.Title>
  </Card.Header>
  <Card.Content
    class="flex space-x-4 justify-between text-sm text-muted-foreground"
  >
    <div class="flex items-center">
      <Clock class="mr-1 h-3 w-3 " />
      {timeAgo(conversation.created_at)} sedan
    </div>
  </Card.Content>
</Card.Root>
