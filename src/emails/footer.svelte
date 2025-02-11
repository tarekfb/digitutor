<script lang="ts">
  import { prodBaseUrl } from "src/lib/shared/constants/constants.ts";
  import { Text } from "svelty-email";

  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

  const footer = {
    fontFamily,
    fontSize: "12px",
    color: "hsl(215.4, 16.3%, 35%)", // --muted-foreground
    textAlign: "center" as const,
    marginTop: "20px",
  };
</script>

<footer>
  <Text style={footer}>{prodBaseUrl}</Text>
</footer>
