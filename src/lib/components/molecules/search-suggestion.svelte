<script lang="ts">
  import { languages } from "src/lib/shared/models/common.ts";
  import SearchSubjectButton from "../atoms/search-subject-button.svelte";
  import SecondaryTitle from "../atoms/secondary-title.svelte";
  import type { Subject } from "src/lib/shared/models/subject.ts";

  export let setSuggestion: (subjectName: string) => void;

  const getSuggestions = (): Subject[] => {
    const js = languages.find((subject) => subject.title === "JavaScript");
    const python = languages.find((subject) => subject.title === "Python");
    const java = languages.find((subject) => subject.title === "Java");
    const cSharp = languages.find((subject) => subject.title === "C#");

    return [js, python, java, cSharp]
      .filter((subject) => subject !== undefined)
      .splice(0, 3);
  };

  const suggestions: Subject[] = [...getSuggestions()];
</script>

{#if suggestions.length > 0}
  <SecondaryTitle>Behöver du ett sökförslag?</SecondaryTitle>
  <ul class="flex w-full justify-center gap-x-2 py-1">
    {#each suggestions as subject}
      <li>
        <SearchSubjectButton
          text={subject.title}
          onClickCallback={setSuggestion}
          class="border-2 border-third"
          textStyling="text-third"
        />
      </li>
    {/each}
  </ul>
{/if}
