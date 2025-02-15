<script>
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import { websiteName } from "src/lib/shared/constants/constants.ts";
</script>

<svelte:head>
  <title>{websiteName} | Tips</title>
</svelte:head>

<RootContainer maxWidth responsiveGap>
  <PrimaryTitle>Tips för lärare</PrimaryTitle>
  <ol class="flex flex-col gap-y-4 list-decimal list-inside">
    <li class="flex flex-col gap-y-2">
      <SecondaryTitle>Använd en bra profilbild</SecondaryTitle>
      <p>
        En trevlig och professionell profilbild ökar chansen att bli kontaktad. Välj en bild där du ser vänlig och tillgänglig ut.
      </p>
    </li>

    <li class="flex flex-col gap-y-2">
      <SecondaryTitle>Skapa en tydlig och informativ profil</SecondaryTitle>
      <p>
        Beskriv tydligt vad du lär ut, din erfarenhet och din undervisningsstil. En välskriven profil hjälper elever att förstå om du passar deras behov.
      </p>
    </li>

    <li class="flex flex-col gap-y-2">
      <SecondaryTitle>Fokusera på att få recensioner</SecondaryTitle>
      <p>
        Lärare med fler recensioner får betydligt fler kontakter. För att få dina första recensioner kan du sänka ditt pris temporärt. När du fått några bra recensioner kan du återgå till din normala prissättning.
      </p>
    </li>

    <li class="flex flex-col gap-y-2">
      <SecondaryTitle>Håll ditt pris konkurrenskraftigt</SecondaryTitle>
      <p>
        Ett pris som är i linje med marknaden lockar fler elever. Tänk på att du alltid kan justera ditt pris baserat på efterfrågan och dina recensioner.
      </p>
    </li>

    <li class="flex flex-col gap-y-2">
      <SecondaryTitle>Var snabb med att svara på meddelanden</SecondaryTitle>
      <p>
En elev kan ha kontaktat flera lärare. Om du svarar först ökar dina chanser att bli vald av eleven.
        </p>
    </li>
  </ol>
</RootContainer>
