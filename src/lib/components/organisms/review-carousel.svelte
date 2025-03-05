<script lang="ts">
  import Stars from "src/lib/components/atoms/stars.svelte";
  import type { ReviewWithReferences } from "src/lib/shared/models/review.ts";
  import Avatar from "../atoms/avatar.svelte";
  import ArrowRight from "lucide-svelte/icons/arrow-right";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import { truncate } from "src/lib/shared/utils/utils.ts";
  import Link from "../atoms/link.svelte";

  export let reviews: Omit<ReviewWithReferences, "createdAt">[];
</script>

<Carousel.Root class="h-full w-full max-w-xs md:max-w-2xl">
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
                class="absolute -top-24 left-2 rotate-180 select-none md:-top-20 md:left-3"
              >
                <span
                  class="font-[helvetica] text-[160px] leading-none text-third/15"
                  >“</span
                >
              </div>
              <p class="overflow-hidden">
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
                    <div class=" flex items-center gap-x-2">
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
                          class="h-7 w-7 text-sm"
                        />
                        <p class="text-lg">{review.receiver.firstName}</p>
                      </a>
                    </div>
                  {/if}
                  <Stars rating={review.rating} starsStylign="size-6" />
                </div>
                <div class="flex justify-between gap-x-2">
                  <Carousel.Previous
                    class="static translate-x-0 translate-y-0"
                  />
                  <Carousel.Next class="static translate-x-0 translate-y-0" />
                </div>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
</Carousel.Root>
<!-- 
<Carousel.Item class="relative flex flex-col gap-3 bg-background p-4 md:p-8 rounded-smd">
  <div class="absolute -left-11 -top-32 rotate-180 select-none">
    <span
      class="font-[helvetica] text-[160px] leading-none text-primary/40"
      >“</span
    >
  </div>
  <blockquote class="z-10 max-w-lg text-3xl">
    {review.description}
  </blockquote>
  <Stars rating={review.rating} />
  {#if review.sender}
    <div class="mt-2.5 flex items-center gap-x-2 self-start">
      <Avatar
        url={review.sender.avatarUrl ?? ""}
        firstName={review.sender.firstName}
        role={review.sender.role}
        class="h-7 w-7 text-sm"
      />
      <cite class="text-lg not-italic">
        {review.sender.firstName}
      </cite>
      <ArrowRight class="size-4" />
      <a
        class="flex items-center gap-x-2"
        href="/profile/{review.receiver.id}"
      >
        <Avatar
          url={review.receiver.avatarUrl ?? ""}
          firstName={review.receiver.firstName}
          role={review.receiver.role}
          class="h-7 w-7 text-sm"
        />
        <p class="text-lg">{review.receiver.firstName}</p>
      </a>
    </div>
  {/if}
</Carousel.Item> -->
