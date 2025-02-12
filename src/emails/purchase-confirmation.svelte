<script lang="ts">
  import {
    pricingPlans,
    websiteName,
    creditProducts,
    prodBaseUrl,
  } from "src/lib/shared/constants/constants.ts";
  import {
    Container,
    Head,
    Link,
    Heading,
    Html,
    Preview,
    Section,
    Text,
  } from "svelty-email";
  import Sign from "./sign.svelte";
  import Footer from "./footer.svelte";

  export let userName: string = "";
  export let priceId: string = "";

  const allProducts = [...creditProducts, ...pricingPlans];
  const matchedProduct = allProducts.find(
    (product) => product.stripePriceId === priceId,
  );

  let productName: string = "";
  let productPrice: string = "";

  if (matchedProduct) {
    productName =
      "credits" in matchedProduct
        ? `${matchedProduct.credits} Credits`
        : matchedProduct.name;
    productPrice = matchedProduct.price;
  }

  const previewText = `Tack för ditt köp på ${websiteName}!`;

  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

  const main = {
    backgroundColor: "hsl(0, 0%, 95%)",
    padding: "20px 0",
  };

  const container = {
    margin: "0 auto",
    padding: "20px",
    width: "580px",
    backgroundColor: "hsl(0, 0%, 100%)",
    borderRadius: "0.5rem",
  };

  const heading = {
    fontFamily,
    fontSize: "24px",
    fontWeight: "700",
    color: "hsl(222.2, 47.4%, 11.2%)",
    marginBottom: "16px",
  };

  const paragraph = {
    fontFamily,
    fontSize: "16px",
    color: "hsl(215.4, 16.3%, 35%)",
    lineHeight: "1.5",
  };
</script>

<Html>
  <Head />
  <Preview preview={previewText} />
  <Section style={main}>
    <Container style={container}>
      <Heading style={heading}>Tack för ditt köp!</Heading>
      <Text style={paragraph}>
        Hej{userName ? ` ${userName}` : ""}!
      </Text>
      {#if productName && productPrice}
        <Text style={paragraph}>
          Vi bekräftar härmed din beställning. Du har köpt <strong
            >{productName}</strong
          >
          för <strong>{productPrice}</strong>.
        </Text>
      {:else}
        <Text style={paragraph}>
          Vi bekräftar härmed din beställning. Tack för ditt köp hos oss.
        </Text>
      {/if}

      <Text style={paragraph}>
        Produkten har aktiverats på ditt konto och är redo att användas. Du kan
        se mer information på ditt konto via <Link
          href="{prodBaseUrl}/account/billing">betalningar</Link
        >.
      </Text>

      <Text style={paragraph}>
        Om du har några frågor, tveka inte att <Link
          href="{prodBaseUrl}/contact-us">kontakta oss</Link
        >.
      </Text>

      <Sign />
      <Footer />
    </Container>
  </Section>
</Html>
