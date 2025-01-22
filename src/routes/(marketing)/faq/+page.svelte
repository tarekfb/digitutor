<script>
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import { websiteName } from "src/lib/shared/constants/constants";
</script>

<svelte:head>
  <title>{websiteName} | Vanliga frågor och svar</title>
</svelte:head> 

<RootContainer>
  <PrimaryTitle>Vanliga frågor och svar</PrimaryTitle>
  <SecondaryTitle>Not implemented</SecondaryTitle>
</RootContainer>
