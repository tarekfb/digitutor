<script>
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import { websiteName } from "src/lib/shared/constants/constants.ts";
</script>

<svelte:head>
  <title>{websiteName} | Tips</title>
</svelte:head>

<RootContainer maxWidth responsiveGap minWidth class=" max-w-full">
  <PrimaryTitle>Tips för lärare</PrimaryTitle>
  <main
    class="mt-4 flex list-inside flex-col gap-y-4 *:flex *:flex-col *:gap-y-2 md:mt-6"
  >
    <section>
      <SecondaryTitle>Fokusera på att få recensioner</SecondaryTitle>
      <p>
        Lärare med fler recensioner får betydligt fler kontaktförfrågningar. Det
        kan vara väldigt svårt att komma igång om du tar ett högt timpris men
        inte har (eller har väldigt få) recensioner. För att få dina första
        recensioner kan du sänka ditt pris temporärt. När du fått några bra
        recensioner kan du återgå till din normala prissättning.
      </p>
      <p>
        <strong>Detta är utan tvekan viktigaste rekomendationen här</strong> - om
        du ska ändra något är detta en bra plats att börja på.
      </p>
    </section>
    <section>
      <SecondaryTitle>Använd en bra profilbild</SecondaryTitle>
      <p>
        En trevlig och professionell profilbild ökar chansen att bli kontaktad.
        Välj en bild där du ser vänlig och tillgänglig ut.
      </p>
    </section>

    <section>
      <SecondaryTitle>Skapa en tydlig och informativ profil</SecondaryTitle>
      <p>
        Beskriv tydligt vad du lär ut, din erfarenhet och din undervisningsstil.
        En välskriven profil hjälper elever att förstå om du passar deras behov.
      </p>
    </section>

    <section>
      <SecondaryTitle>Håll ditt pris konkurrenskraftigt</SecondaryTitle>
      <p>
        Ett pris som är i linje med marknaden lockar fler elever. Tänk på att du
        alltid kan justera ditt pris baserat på efterfrågan och dina
        recensioner.
      </p>
    </section>

    <section>
      <SecondaryTitle>Var snabb med att svara på meddelanden</SecondaryTitle>
      <p>
        En elev kan ha kontaktat flera lärare. Om du svarar först ökar dina
        chanser att bli vald av eleven.
      </p>
    </section>
  </main>
</RootContainer>
