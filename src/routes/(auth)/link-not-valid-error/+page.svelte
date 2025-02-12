<script lang="ts">
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import Link from "$lib/components/atoms/link.svelte";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import TriangleAlert from "lucide-svelte/icons/triangle-alert";
  import { websiteName } from "src/lib/shared/constants/constants.ts";
</script>

<svelte:head>
  <title>{websiteName} | Ogiltig länk</title>
</svelte:head>

<RootContainer minWidth maxWidth class="items-start gap-y-4 md:gap-y-6">
  <TriangleAlert size="100" class="self-center text-warning" />
  <PrimaryTitle class="self-center text-wrap text-center"
    >Länken är inte längre tillgänglig</PrimaryTitle
  >
  <p class="text-muted-foreground">
    Du tryckte på en länk som inte längre är giltig. Detta kan bero på att
    länken har överskridit sin giltighetstid, att den redan har förbrukats,
    eller att ett oväntat fel uppstod. Vi tar dessa åtgärder för att skydda våra
    användares konton och förhindra obehörig åtkomst.
  </p>
  <p class="text-muted-foreground">
    Du kan begära en ny länk genom att upprepa åtgärden eller <Link
      href="/contact-us">kontakta oss</Link
    > om problemet kvarstår.
  </p>
</RootContainer>
