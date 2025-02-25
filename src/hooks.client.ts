// import * as Sentry from '@sentry/sveltekit';
// import { initSentryHasnd, sentryHandle } from '@sentry/sveltekit';
// import { sequence } from '@sveltejs/kit/hooks';

// export const handle = sequence(
//     initCloudflareSentryHandle({
//         dsn: "https://485a49edf664c4bad08c2ab0bf87a8eb@o4507622077169664.ingest.de.sentry.io/4507622079660112",
//         tracesSampleRate: 1.0,
//         integrations: [Sentry.replayIntegration()],
//     }),
//     sentryHandle(),
// );