<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Terminal } from "lucide-svelte";
  import Avatar from "../atoms/avatar.svelte";
  import type { SearchResult } from "src/lib/shared/models/search";
  import { Subjects } from "src/lib/shared/models/common";
  import { ChevronRight } from "lucide-svelte";
  import { mediaQuery } from "svelte-legos";
  import SubjectItem from "../atoms/subject-item.svelte";

  const isDesktop = mediaQuery("(min-width: 768px)");

  export let result: SearchResult;
</script>

<a
  href="/profile/{result.profile.id}?id={result.id}"
  aria-label="Gå till annons"
>
  <Card.Root>
    <Card.Header >
      <Card.Title
        class="flex justify-between gap-x-2 items-center md:text-2xl bg-accent -mx-6 -mt-6 px-6 pt-4 pb-4  text-white "
        tag="h3"
      >
        {result.title}
        <Avatar
          url={result.avatar ?? ""}
          firstName={result.firstName}
          lastName={result.lastName}
          onClick={undefined}
        />
      </Card.Title>
      <ul class="flex justify-start gap-x-4 flex-wrap">
        {#each result.subjects as subject, i}
          {#if ($isDesktop && i < 6) || (!$isDesktop && i < 3)}
            <SubjectItem {subject} />
          {/if}
        {/each}
      </ul>
      <h4>Hej</h4>
    </Card.Header>
    <Card.Content
      class="flex justify-between space-x-4 text-sm text-muted-foreground"
    >
      <!-- <ul class="flex items-center">
          {#each listing.subjects as subject}
            <li class="flex items-center">
              <Terminal class="mr-1 h-3 w-3 text-accent" />
              {subject}
            </li>
          {/each}
        </ul> -->
      <span class="flex items-center">
        <Terminal class="mr-1 h-3 w-3 text-accent" />
        Typescript
      </span>
      <p>{result.hourlyPrice} SEK</p>
      <p>{result.firstName}</p>
    </Card.Content>
  </Card.Root>
</a>
