<script lang="ts">
  import { websiteName } from "$lib/constants";
  import type { Listing } from "$lib/server/database/listings.js";
  import ListingComponent from "$lib/components/listing.svelte";

  export let data;
  const listings: Listing[] | null = data.listings;
</script>

<svelte:head>
  <title>{websiteName}</title>
  <meta name="description" content="{websiteName} Home Page" />
</svelte:head>

<div class="hero min-h-[60vh]">
  <div class="hero-content text-center py-12">
    <div class="max-w-xl">
      <div
        class="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4 md:mb-8"
      >
        Mindic
      </div>

      <div
        class="text-4xl md:text-6xl font-bold px-2"
        style="line-height: 1.2;"
      >
        The
        <span
          class="underline decoration-secondary decoration-4 md:decoration-[6px]"
          >open source</span
        >,
        <span
          class="underline decoration-secondary decoration-4 md:decoration-[6px]"
          >fast</span
        >, and
        <span
          class="underline decoration-secondary decoration-4 md:decoration-[6px]"
          >free to host</span
        >
        <span> SaaS template</span>
      </div>
      <div class="mt-6 md:mt-10 text-sm md:text-lg">
        Built with <a
          href="https://kit.svelte.dev"
          class="link font-bold"
          target="_blank">SvelteKit</a
        >,
        <a href="https://supabase.com" class="link font-bold" target="_blank"
          >Supabase</a
        >,
        <a href="https://stripe.com" class="link font-bold" target="_blank"
          >Stripe</a
        >,
        <a href="https://tailwindcss.com" class="link font-bold" target="_blank"
          >Tailwind</a
        >,
        <a href="https://daisyui.com" class="link font-bold" target="_blank"
          >DaisyUI</a
        >, and
        <a
          href="https://www.postgresql.org"
          class="link font-bold"
          target="_blank">Postgres</a
        >
      </div>
      <div class="mt-6 md:mt-2">
        <a href="https://github.com/CriticalMoments/CMSaasStarter">
          <button class="btn btn-primary btn-sm px-6">★ us on Github</button>
        </a>
        <a
          href="https://github.com/CriticalMoments/CMSaasStarter/tree/main#saas-starter"
        >
          <button class="btn btn-outline btn-primary btn-sm px-6 mt-3 mx-2"
            >Read the Docs</button
          >
        </a>
      </div>
    </div>
  </div>
</div>
<div class="min-h-[60vh]">
  <div class="pt-20 pb-8 px-7">
    <div class="max-w-lg mx-auto text-center">
      <div
        class="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
      >
        Spana in våra lärare
      </div>
      <div class="mt-6 text-xl font-bold">
        Hör av dig och
        <span
          class="underline decoration-secondary decoration-[3px] md:decoration-[4px]"
        >
          uppgradera dina skills idag
        </span>
      </div>
    </div>
    {#if listings && listings.length > 0}
      <div class="flex flex-col gap-y-4 mt-12">
        {#each listings as listing}
          <a href="/listings/{listing.id}" aria-label="Navigate to ad">
            <ListingComponent {listing} />
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>
<div class="hero min-h-[60vh] mt-12">
  <div class="hero-content text-center pb-16 pt-4 px-4">
    <div class="max-w-lg">
      <div
        class="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mt-4"
      >
        See it in Action
      </div>
      <div
        class="flex flex-col lg:flex-row mt-8 gap-6 place-content-center content-center"
      >
        <div class="hidden md:block">
          <a href="https://criticalmoments.io" target="_blank" class="link">
            <div class="mockup-browser border">
              <div class="mockup-browser-toolbar">
                <div class="input" style="background:#eee;">
                  https://criticalmoments.io
                </div>
              </div>
              <div class="flex justify-center">
                <img
                  alt="Screenshot of criticalmoments.io homepage"
                  class="aspect-[2044/1242]"
                  src="/images/example-home.png"
                />
              </div>
            </div>
          </a>
        </div>
        <div class="md:hidden">
          <a href="https://criticalmoments.io" target="_blank" class="link">
            <div class="card shadow-xl border overflow-hidden">
              <img
                alt="Screenshot of criticalmoments.io homepage"
                class="aspect-[2044/1242]"
                src="/images/example-home.png"
              />
            </div></a
          >
        </div>
        <div class="min-w-[270px] lg:min-w-[420px] flex mt-6 lg:mt-0">
          <div class="my-auto">
            <div class="px-4 text-lg md:text-xl">
              <a href="https://criticalmoments.io" class="" target="_blank"
                >SaaS Starter was created by <span
                  class="font-bold whitespace-nowrap">Critical Moments</span
                >: a SDK to to help mobile apps
                <span class="underline decoration-secondary decoration-[3px]"
                  >increase conversion rates and app-ratings.</span
                ></a
              >
            </div>
            <div class="px-4 mt-6 text-lg md:text-xl">
              Our <a
                href="https://criticalmoments.io"
                class="link font-bold"
                target="_blank">webpage</a
              > is the best example of SaaS Starter with style and real content.
            </div>
            <div class="mt-4 text-large">
              <a href="https://criticalmoments.io" target="_blank">
                <button class="btn btn-primary btn-wide mt-3"
                  >See it in Action</button
                >
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
