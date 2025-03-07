<script lang="ts">
  import Stars from "src/lib/components/atoms/stars.svelte";
  import type { ReviewWithReferences } from "src/lib/shared/models/review.ts";
  import Avatar from "../atoms/avatar.svelte";
  import ArrowRight from "lucide-svelte/icons/arrow-right";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import { truncate } from "src/lib/shared/utils/utils.ts";
  import Link from "../atoms/link.svelte";
  import Autoplay from "embla-carousel-autoplay";
  import Quote from "src/lib/icons/quote.svelte";

  export let reviews: Omit<ReviewWithReferences, "createdAt">[];
</script>

<Carousel.Root
  class="h-full w-full max-w-xs md:max-w-2xl"
  plugins={[
    Autoplay({
      delay: 5000,
    }),
  ]}
>
  <Carousel.Content>
    {#each reviews as review}
      {@const { text, truncated } = truncate(review.description, 50)}
      <Carousel.Item>
        <div class="h-full p-1">
          <Card.Root class="h-full">
            <Card.Content
              class="relative flex h-full w-full flex-col items-center justify-between gap-y-6 p-8 md:gap-y-8 md:px-16"
            >
              <div
                class="absolute left-0 top-0 rotate-180 select-none md:-top-20 md:left-3"
              >
                <Quote fillHex="#E0E0E0" width={60} height={60} />
              </div>
              <p class="z-10 overflow-hidden flex-grow flex flex-col justify-center">
                {text}
                {#if truncated}
                  <Link
                    href="/profile/{review.receiver.id}#{review.id}"
                    class="whitespace-nowrap">Läs hela</Link
                  >
                {/if}
              </p>
              <div
                class="flex w-full flex-col items-center gap-y-2 md:flex-row md:justify-between md:gap-y-4"
              >
                <div class="flex flex-col items-center gap-y-2">
                  {#if review.sender}
                    <div
                      class="flex items-center gap-x-2 text-muted-foreground"
                    >
                      <Avatar
                        url={review.sender.avatarUrl ?? ""}
                        firstName={review.sender.firstName}
                        role={review.sender.role}
                        class="size-7 text-sm"
                      />
                      <cite class="text-lg not-italic">
                        {review.sender.firstName}
                      </cite>
                      <ArrowRight class="size-4" aria-label="Till lärare:" />
                      <a
                        class="flex items-center gap-x-2"
                        href="/profile/{review.receiver.id}"
                      >
                        <Avatar
                          url={review.receiver.avatarUrl ?? ""}
                          firstName={review.receiver.firstName}
                          role={review.receiver.role}
                          class="size-7 text-sm"
                        />
                        <p class="text-lg">{review.receiver.firstName}</p>
                      </a>
                    </div>
                  {/if}
                  <Stars rating={review.rating} starsStylign="size-6" />
                </div>
                {#if reviews.length > 1}
                  <div class="flex justify-between gap-x-2">
                    <Carousel.Previous
                      class="static translate-x-0 translate-y-0"
                    />
                    <Carousel.Next class="static translate-x-0 translate-y-0" />
                  </div>
                {/if}
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
</Carousel.Root>
