<script lang="ts">
  import { prodBaseUrl } from "src/lib/shared/constants/constants.ts";
  import {
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
  } from "svelty-email";

  export let studentName: string = "";
  export let teacherName: string = "";
  export let contactRequestUrl: string = "";

  const previewText = `${studentName || "En elev"} har skickat en kontaktförfrågan till dig!`;

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

  const footer = {
    fontFamily,
    fontSize: "12px",
    color: "hsl(215.4, 16.3%, 35%)", // --muted-foreground
    textAlign: "center" as const,
    marginTop: "20px",
  };
  const sign = {
    fontFamily,
    color: "hsl(215.4, 16.3%, 35%)", // --muted-foreground
    marginTop: "20px",
  };
</script>

<Html>
  <Head />
  <Preview preview={previewText} />
  <Section style={main}>
    <Container style={container}>
      <Heading style={heading}
        >{studentName || "En elev"} vill komma i kontakt med dig</Heading
      >
      <Text style={paragraph}
        >Hej{teacherName ? ` ${teacherName}` : ""}! {studentName || "En elev"} har
        skickat en kontaktförfrågan. Tryck på knappen nedan för att svara .
      </Text>
      <Text style={sign}>—Digitutor-teamet</Text>
      <Section style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          style={button}
          href={contactRequestUrl || `${prodBaseUrl}/account`}
          >Visa förfrågan</Button
        >
      </Section>
      <Text style={footer}>{prodBaseUrl}</Text>
    </Container>
  </Section>
</Html>
