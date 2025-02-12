<script lang="ts">
  import { prodBaseUrl, websiteName } from "src/lib/shared/constants/constants.ts";
  import {
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Link,
  } from "svelty-email";
  import Sign from "./sign.svelte.ts";
  import Footer from "./footer.svelte.ts";

  export let studentName: string = "";

  const previewText = `Ditt konto hos ${websiteName} har avslutats.`;

  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

  const main = {
    backgroundColor: "hsl(0, 0%, 95%)", // --background
    padding: "20px 0",
  };

  const container = {
    margin: "0 auto",
    padding: "20px",
    width: "580px",
    backgroundColor: "hsl(0, 0%, 100%)", // --card
    borderRadius: "0.5rem", // --radius
  };

  const heading = {
    fontFamily,
    fontSize: "24px",
    fontWeight: "700",
    color: "hsl(222.2, 47.4%, 11.2%)", // --primary
    marginBottom: "16px",
  };

  const paragraph = {
    fontFamily,
    fontSize: "16px",
    color: "hsl(215.4, 16.3%, 35%)", // --muted-foreground
    lineHeight: "1.5",
  };
</script>

<Html>
  <Head />
  <Preview preview={previewText} />
  <Section style={main}>
    <Container style={container}>
      <Heading style={heading}>Tack för din tid hos oss!</Heading>
      <Text style={paragraph}>
        Hej{studentName ? ` ${studentName}` : ""}!
      </Text>
      <Text style={paragraph}>
        Ditt konto hos oss har nu tagits bort. Vi hoppas att vi har varit till
        nytta på din resa och att vi kanske ses igen i framtiden.
      </Text>
      <Text style={paragraph}>
        Om du inte begärde denna handling eller har några frågor eller
        synpunkter kan du alltid <Link href="{prodBaseUrl}/contact-us"
          >kontakta oss</Link
        >.
      </Text>
      <Sign />
      <Footer />
    </Container>
  </Section>
</Html>
