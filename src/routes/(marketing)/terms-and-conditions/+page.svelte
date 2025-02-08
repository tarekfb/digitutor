<script lang="ts">
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import RootContainer from "$lib/components/templates/root-container.svelte";
  import Link from "$lib/components/atoms/link.svelte";
  import { websiteName } from "$lib/shared/constants/constants.ts";
</script>

<svelte:head>
  <title>{websiteName} | Användarvillkor</title>
</svelte:head>

<RootContainer responsiveGap maxWidth class="items-start">
  <PrimaryTitle class="self-center">Användarvillkor</PrimaryTitle>
  <p>
    Läs noggrant igenom våra villkor innan du använder {websiteName}.
  </p>
  <h2>1. Allmänt</h2>
  <p>
    Dessa villkor gäller för din användning av {websiteName}, en plattform som
    förmedlar kontakt mellan studenter och lärare. Genom att använda tjänsten
    godkänner du dessa villkor.
  </p>

  <h2>2. Åldersgräns</h2>
  <p>
    Du måste vara minst 18 år för att använda tjänsten. Genom att skapa ett
    konto bekräftar du att du uppfyller denna åldersgräns.
  </p>

  <h2>3. Konto och verifiering</h2>
  <p>
    Alla användare, både studenter och lärare, måste registrera ett konto och
    verifiera sin e-postadress.
  </p>

  <h2>4. Betalningar och krediter</h2>
  <p>
    Betalningar sker utanför plattformen. Studenter kan köpa premium för
    obegränsade kontakter eller köpa krediter, där varje ny kontakt med en
    lärare kostar krediter.
  </p>

  <h2>5. Plattformens roll</h2>
  <p>
    {websiteName} är endast en förmedlare och ansvarar inte för undervisningens kvalitet
    eller användarinteraktioner.
  </p>

  <h2>6. Användarbeteende och moderering</h2>
  <p>
    Trakasserier, missbruk eller olämpligt beteende tolereras inte och kan
    resultera i omedelbar avstängning utan förvarning.
  </p>

  <h2>7. Personuppgifter</h2>
  <p>
    Vi hanterar dina personuppgifter enligt vår <a href="/integrity-policy"
      >Integritetspolicy</a
    >.
  </p>

  <h2>8. Ändringar i villkoren</h2>
  <p>
    Vi förbehåller oss rätten att ändra dessa villkor vid behov. Fortsatt
    användning av plattformen efter ändringar innebär att du godkänner de
    uppdaterade villkoren.
  </p>
</RootContainer>
