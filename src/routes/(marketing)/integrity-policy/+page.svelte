<script lang="ts">
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import {
    websiteName,
    prodBaseUrl,
    contactEmail,
  } from "src/lib/shared/constants/constants.ts";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
</script>

<svelte:head>
  <title>{websiteName} | Integritetspolicy</title>
</svelte:head>
<RootContainer maxWidth responsiveGap class="items-start">
  <PrimaryTitle class="self-center">Integritetspolicy</PrimaryTitle>
  <p>
    {websiteName} är personuppgiftsansvarig för behandlingen av personuppgifter som
    beskrivs i denna integritetspolicy. I denna integritetspolicy förklarar vi vilken
    typ av personuppgifter vi lagrar och hur vi behandlar dem. Denna integritetspolicy
    gäller för <a href={prodBaseUrl}>{prodBaseUrl}</a>
  </p>

  <h2>1. Personuppgifter som vi samlar in och behandlar</h2>
  <div>
    <p>Vi behandlar följande kategorier av personuppgifter:</p>
    <ul class="list-inside list-disc">
      <li>Grundläggande information: förnamn, efternamn</li>
      <li>Kontaktinformation: e-postadress</li>
      <li>Konto- och profilinformation: inställningar, preferenser</li>
    </ul>
  </div>
  <p>
    Personuppgifterna samlas vanligtvis in direkt från dig eller genereras i
    samband med att du använder våra tjänster och produkter. När vi hämtar
    personuppgifter från andra källor, hämtar vi personuppgifter från följande
    källor:
  </p>

  <h2>2. Hur vi använder personuppgifter</h2>

  <h3>2.1 Leverans av tjänst/avtal</h3>
  <p>
    Vi använder dina personuppgifter för att uppfylla våra avtal med dig, det
    vill säga när du har beställt en produkt eller tjänst från oss. Det
    rättsliga grunden för att behandla personuppgifter för detta ändamål är att
    behandlingen är nödvändig för att uppfylla ett avtal med dig.
  </p>

  <h3>2.2 Hantering av kundrelationer</h3>
  <p>
    Vi använder dina personuppgifter för att hantera vår kundrelation med dig.
    Det kan till exempel handla om kundtjänst, hantering av klagomål och
    felsökning gällande ditt konto. Den rättsliga grunden för att behandla
    personuppgifter för detta ändamål är att behandlingen är nödvändig för att
    uppfylla ett avtal med dig.
  </p>

  <h3>2.3 Analys, affärsutveckling och förbättring av tjänster</h3>
  <p>
    Vi arbetar kontinuerligt med att utveckla och förbättra våra tjänster och
    produkter. En stor del av detta arbete innebär att analysera olika former av
    personuppgifter, till exempel kundaktivitet, kundhistorik och konto- och
    profilinformation. Den rättsliga grunden för att behandla personuppgifter
    för detta ändamål är vårt berättigade intresse.
  </p>

  <h3>2.4 Anpassad användarupplevelse</h3>
  <p>
    Vi anpassar användarupplevelsen och kommunikationen till din kundrelation
    och vi använder personuppgifter för detta ändamål. Den rättsliga grunden för
    att behandla personuppgifter för detta ändamål är vårt berättigade intresse.
  </p>

  <h3>2.5 Försäljning och marknadsföring</h3>
  <p>
    Vi använder personuppgifter i samband med försäljning och marknadsföring av
    våra produkter och tjänster, till exempel genom att du får e-post från oss.
    Den rättsliga grunden för att behandla personuppgifter för detta ändamål är
    vårt berättigade intresse.
  </p>
  <p>
    Du har möjlighet att reservera dig från delar av denna behandling genom att
    till exempel välja att inte ta emot e-post från oss. Utöver detta kan vi
    också be dig om samtycke att använda dina personuppgifter för så kallad
    profilering, där vi drar slutsatser om dina intressen och behov utifrån dina
    personuppgifter. Syftet med profileringen är att vår marknadsföring ska bli
    mer relevant.
  </p>

  <h3>2.6 Systemövervakning och felsökning</h3>
  <p>
    Vi övervakar våra system för fel och problem. En del av dessa processer
    innebär lagring och behandling av personuppgifter. Den rättsliga grunden för
    att behandla personuppgifter för detta ändamål är vårt berättigade intresse.
  </p>

  <h3>2.7 Säkerhet och bedrägeribekämpning</h3>
  <p>
    Vi behandlar personuppgifter i vårt arbete med att skydda våra användare och
    oss själva mot bedrägeri, missbruk och kriminell verksamhet. Den rättsliga
    grunden för att behandla personuppgifter för detta ändamål är vårt
    berättigade intresse.
  </p>

  <h3>2.8 Följa rättsliga åtaganden</h3>
  <p>
    I vissa fall är vi skyldiga att behandla personuppgifter av hänsyn till
    andra rättsliga åtaganden. Ett exempel på detta är information kopplad till
    försäljning, som vi är skyldiga att bokföra och spara enligt
    bokföringslagen. Den rättsliga grunden för denna behandling är att den är
    nödvändig för att uppfylla ett rättsligt åtagande.
  </p>

  <h2>3. Dina rättigheter</h2>
  <p>
    Om du vill utöva någon av dina rättigheter, kontakta oss på
    <a href="mailto:{contactEmail}" class="text-blue-600 underline"
      >info@digitutor.se</a
    >.
  </p>

  <h3>3.1 Rätt till insyn i egna uppgifter</h3>
  <p>Du kan begära en kopia av alla uppgifter vi behandlar om dig.</p>

  <h3>3.2 Rätt till rättelse av personuppgifter</h3>
  <p>
    Du har rätt att begära att vi rättar eller kompletterar uppgifter som är
    felaktiga eller vilseledande.
  </p>

  <h3>3.3 Rätt till radering av personuppgifter</h3>
  <p>
    Du har rätt att få dina personuppgifter raderade utan dröjsmål. Men notera
    att information som vi är skyldiga att behålla av hänsyn till andra
    rättsliga åtaganden (som till exempel bokföringslagen) inte kommer att
    raderas.
  </p>

  <h3>3.4 Begränsning av behandling av personuppgifter</h3>
  <p>
    I vissa situationer kan du begära att vi begränsar behandlingen av uppgifter
    om dig. Du gör detta genom att administrera samtycken eller reservationer i
    våra lösningar.
  </p>

  <h3>3.5 Protestera mot behandling av personuppgifter</h3>
  <p>
    Om vi behandlar uppgifter om dig med grund i vårt berättigade intresse eller
    på grundval av en intresseavvägning har du rätt att protestera mot vår
    behandling.
  </p>

  <h3>3.6 Dataportabilitet</h3>
  <p>
    Du har rätt att få ut dina personuppgifter i ett strukturerat, allmänt
    använt och maskinläsbart format.
  </p>

  <h3>3.7 Klagomål på vår behandling av personuppgifter</h3>
  <p>
    Vi hoppas att du informerar oss om du anser att vi inte följer reglerna i
    personuppgiftslagen. Säg gärna till först genom den kontakten eller kanalen
    du redan har etablerat med oss. Du kan också klaga på vår behandling av
    personuppgifter genom att vända dig till
    <a
      href="https://www.imy.se/"
      target="_blank"
      class="text-blue-600 underline">Integritetsskyddsmyndigheten</a
    >.
  </p>
  <h2>4. Hur vi hanterar kakor</h2>
  <p>
    På {websiteName} använder vi funktionella kakor för att säkerställa att du kan
    få tillgång till säkra delar av vår webbplats. Dessa kakor lagras på din enhet
    och gör det möjligt för oss att komma ihåg och autentisera din användning av
    skyddade områden på webbplatsen.
  </p>
  <p>
    Kakor är små textfiler som lagras på din webbläsare och används för att
    förbättra din användarupplevelse genom att komma ihåg information om ditt
    besök. Vi använder endast funktionella kakor som är nödvändiga för att
    webbplatsen ska fungera korrekt.
  </p>
  <p>
    Du kan hantera och kontrollera användningen av kakor via din webbläsare.
    Genom att fortsätta använda vår webbplats samtycker du till användningen av
    dessa kakor.
  </p>
</RootContainer>
