<script lang="ts">
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import { websiteName, prodBaseUrl } from "src/lib/shared/constants/constants";
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

  <h2>Personuppgifter som vi samlar in och behandlar</h2>
  <div>
    <p>Vi behandlar följande kategorier av personuppgifter:</p>
    <ul class="list-disc">
      <li>Grundläggande information: namn, födelsedatum</li>
      <li>Kontaktinformation: adress, telefonnummer, e-postadress</li>
      <li>Konto- och profilinformation: inställningar, preferenser</li>
      <li>Betalningsinformation: transaktionsinformation, betalningsmedel</li>
      <li>
        Kundhistorik och kundengagemang: beställnings- och leveransinformation,
        kundvagnsrörelser, rabattkoder, lojalitetsprograminformation, aktiva
        produkter och avtal, produkter och tjänster som du tidigare haft
      </li>
      <li>
        Kundaktivitet: läs- och handlingshistorik från appen, webbplatser eller
        elektronisk kommunikation vi skickar ut
      </li>
      <li>Teknisk information om enheterna du använder</li>
    </ul>
  </div>
  <p>
    Personuppgifterna samlas vanligtvis in direkt från dig eller genereras i
    samband med att du använder våra tjänster och produkter. När vi hämtar
    personuppgifter från andra källor, hämtar vi personuppgifter från följande
    källor:
  </p>
  <h2>Hur vi använder personuppgifter</h2>
  <h3>Leverans av tjänst/avtal</h3>
  <p>
    Vi använder dina personuppgifter för att uppfylla våra avtal med dig, det
    vill säga när du har beställt en produkt eller tjänst från oss. Det
    rättsliga grunden för att behandla personuppgifter för detta ändamål är att
    behandlingen är nödvändig för att uppfylla ett avtal med dig.
  </p>

  <h3>Hantering av kundrelationer</h3>
  <p>
    Vi använder dina personuppgifter för att hantera vår kundrelation med dig.
    Det kan till exempel handla om kundtjänst, hantering av klagomål och
    felsökning gällande ditt konto. Den rättsliga grunden för att behandla
    personuppgifter för detta ändamål är att behandlingen är nödvändig för att
    uppfylla ett avtal med dig.
  </p>
  <h3>Analys, affärsutveckling och förbättring av tjänster</h3>
  <p>
    Vi arbetar kontinuerligt med att utveckla och förbättra våra tjänster och
    produkter. En stor del av detta arbete innebär att analysera olika former av
    personuppgifter, till exempel kundaktivitet, kundhistorik och konto- och
    profilinformation. Den rättsliga grunden för att behandla personuppgifter
    för detta ändamål är vårt berättigade intresse. </p><h3>Anpassad användarupplevelse</h3><p>
    Vi anpassar användarupplevelsen och kommunikationen till din kundrelation
    och vi använder personuppgifter för detta ändamål. Den rättsliga grunden för
    att behandla personuppgifter för detta ändamål är vårt berättigade intresse.
    Försäljning och marknadsföring Vi använder personuppgifter i samband med
    försäljning och marknadsföring av våra produkter och tjänster, till exempel
    genom att du får e-post från oss. Den rättsliga grunden för att behandla
    personuppgifter för detta ändamål är vårt berättigade intresse. Du har
    möjlighet att reservera dig från delar av denna behandling genom att till
    exempel reservera dig från att få e-post från oss. Utöver detta kan vi också
    be dig om samtycke att använda dina personuppgifter för så kallad
    profilering, där vi drar slutsatser om dina intressen och behov utifrån dina
    personuppgifter. Syftet med profileringen är att vår marknadsföring ska bli
    mer relevant. Systemövervakning, felsökning m.m. Vi övervakar våra system
    för fel och problem. En del av dessa processer innebär lagring och
    behandling av personuppgifter. Den rättsliga grunden för att behandla
    personuppgifter för detta ändamål är vårt berättigade intresse. Säkerhet,
    avslöjande av bedrägeri och kriminell verksamhet Vi behandlar
    personuppgifter i vårt arbete med att skydda våra användare och oss själva
    mot bedrägeri, missbruk och kriminell verksamhet. Den rättsliga grunden för
    att behandla personuppgifter för detta ändamål är vårt berättigade intresse.
    Följa rättsliga åtaganden I vissa fall är vi skyldiga att behandla
    personuppgifter av hänsyn till andra rättsliga åtaganden. Ett exempel på
    detta är information som är kopplad till försäljning, som vi är skyldiga att
    bokföra och spara enligt bokföringslagen. Det rättsliga grunden för att
    behandla personuppgifter för detta ändamål är att behandlingen är nödvändig
    för att uppfylla ett rättsligt åtagande som åligger oss. Dina rättigheter Om
    du vill utöva någon av dina rättigheter, kontakta oss på
    <a href="mailto:info@digitutor.se">info@digitutor.se</a>. Rätt till insyn i
    egna uppgifter Du kan begära en kopia av alla uppgifter vi behandlar om dig.
    Kontakta e-postadressen ovan för att utnyttja din insynsrätt. Rätt till
    rättelse av personuppgifter Du har rätt att begära att vi rättar eller
    kompletterar uppgifter som är felaktiga eller vilseledande. Rätt till
    radering av personuppgifter Du har rätt att få dina personuppgifter raderade
    utan dröjsmål. Du kan när som helst begära att vi raderar uppgifter om dig
    själv. Men notera att information som vi är skyldiga att behålla av hänsyn
    till andra rättsliga åtaganden (som till exempel bokföringslagen) inte
    kommer att raderas. Begränsning av behandling av personuppgifter I vissa
    situationer kan du också begära att vi begränsar behandlingen av uppgifter
    om dig. Du gör detta genom att administrera samtycken eller reservationer i
    våra lösningar. Protestera mot behandling av personuppgifter Om vi behandlar
    uppgifter om dig med grund i våra uppgifter eller på grundval av en
    intresseavvägning har du rätt att protestera mot vår behandling av uppgifter
    om dig. Du gör detta genom att administrera samtycken eller reservationer i
    våra lösningar. Dataportabilitet Du har rätt att få ut dina personuppgifter
    i ett strukturerat, allmänt använt och maskinläsbart format. Kontakta
    e-postadressen ovan för att få ut dina personuppgifter. Du kan klaga på vår
    behandling av personuppgifter Vi hoppas att du informerar oss om du anser
    att vi inte följer reglerna i personuppgiftslagen. Säg gärna till först
    genom den kontakten eller kanalen du redan har etablerat med oss. Du kan
    också klaga på vår behandling av personuppgifter. Du gör detta till
    Integritetsskyddsmyndigheten.
  </p>
</RootContainer>
