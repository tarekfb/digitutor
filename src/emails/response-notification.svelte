<script lang="ts">
  import {
    prodBaseUrl,
    websiteName,
  } from "src/lib/shared/constants/constants.ts";
  import {
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Button,
  } from "svelty-email";
  import Sign from "./sign.svelte";
  import Footer from "./footer.svelte";

  export let studentName: string = "";
  export let conversationId: string = "";

  const conversationUrl = conversationId
    ? `${prodBaseUrl}/conversations/${conversationId}`
    : `${prodBaseUrl}/account`;

  const previewText = `Din kontaktförfrågan på ${websiteName} har besvarats!`;

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

  const button = {
    fontFamily,
    backgroundColor: "hsl(197, 100%, 29%)", // --third
    borderRadius: "6px",
    color: "hsl(210, 40%, 98%)", // --primary-foreground
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
    fontWeight: "bold",
  };
</script>

<Html>
  <Head />
  <Preview preview={previewText} />
  <Section style={main}>
    <Container style={container}>
      <Heading style={heading}>Din kontaktförfrågan har besvarats!</Heading>
      <Text style={paragraph}>
        Hej{studentName ? ` ${studentName}` : ""}!
      </Text>
      <Text style={paragraph}>
        En lärare har svarat din kontaktförfrågan. Tryck på knappen nedan för
        att gå till konversationen.
      </Text>
      <Sign />
      <Section style={{ textAlign: "center", marginTop: "20px" }}>
        <Button style={button} href={conversationUrl}>Visa konversation</Button>
      </Section>
      <Footer />
    </Container>
  </Section>
</Html>
