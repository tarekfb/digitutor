<script lang="ts">
  import {
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
  } from "svelty-email";

  // const baseUrl = process.<wbr/>env.VERCEL_URL ? `https://${process.<wbr/>env.VERCEL_URL}` : '';

  export let studentName: string;
  export let reviewText: string;
  // export let studentName: string;
  // export let authorImage: string;

  const previewText = `Du fick en kontaktförfrågan av ${studentName}!`;

  const fontFamily =
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

  const main = {
    backgroundColor: "#f2f2f2",
  };

  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    width: "580px",
  };

  // const userImage = {
  //   margin: "0 auto",
  //   marginBottom: "16px",
  //   borderRadius: "50%",
  // };

  const heading = {
    fontFamily,
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    color: "#484848",
  };

  const paragraph = {
    fontFamily,
    fontSize: "18px",
    lineHeight: "1.4",
    color: "#484848",
  };

  const review = {
    ...paragraph,
    padding: "24px",
    backgroundColor: "#f2f3f3",
    borderRadius: "4px",
  };

  const button = {
    fontFamily,
    backgroundColor: "#ff5a5f",
    borderRadius: "3px",
    color: "#fff",
    fontSize: "18px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "100%",
  };

  const link = {
    ...paragraph,
    color: "#ff5a5f",
    display: "block",
  };

  const reportLink = {
    fontFamily,
    fontSize: "14px",
    color: "#9ca299",
    textDecoration: "underline",
  };

  const hr = {
    borderColor: "#cccccc",
    margin: "20px 0",
  };

  const footer = {
    fontFamily,
    color: "#9ca299",
    fontSize: "14px",
    marginBottom: "10px",
  };
</script>

<Html>
  <Head />
  <Preview preview={previewText} />
  <Section style={main}>
    <Container style={container}>
      <!-- <Img
        src={`${baseU}/airbnb-logo.png`}
        width="96"
        height="30"
        alt="Airbnb"
      /> -->
      <Section>
        <!-- <Img
          src={authorImage}
          width="96"
          height="96"
          alt={studentName}
          style={userImage}
        /> -->
      </Section>
      <Heading style={heading}>Here's what {studentName} wrote</Heading>
      <Text style={review}>{reviewText}</Text>
      <Text style={paragraph}>
        Now that the review period is over, we’ve posted {studentName}’s review
        to your Airbnb profile.
      </Text>
      <Text style={paragraph}>
        While it’s too late to write a review of your own, you can send your
        feedback to {studentName}
        using your Airbnb message thread.
      </Text>
      <Section style={{ padding: "16px 0 20px" }}>
        <Button pY={19} style={button} href="https://airbnb.com/"
          >Send My Feedback</Button
        >
      </Section>
      <Hr style={hr} />
      <Text style={{ ...paragraph, fontWeight: "700" }}>Common questions</Text>
      <Text>
        <Link href="https://airbnb.com/help/article/13" style={link}
          >How do reviews work?</Link
        >
      </Text>
      <Text>
        <Link href="https://airbnb.com/help/article/1257" style={link}>
          How do star ratings work?
        </Link>
      </Text>
      <Text>
        <Link href="https://airbnb.com/help/article/995" style={link}>
          Can I leave a review after 14 days?
        </Link>
      </Text>
      <Hr style={hr} />
      <Text style={footer}
        >Airbnb, Inc., 888 Brannan St, San Francisco, CA 94103</Text
      >
      <Link href="https://airbnb.com" style={reportLink}
        >Report unsafe behavior</Link
      >
    </Container>
  </Section>
</Html>
