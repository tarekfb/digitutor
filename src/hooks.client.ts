// hooks.client.js
import { init } from '@jill64/sentry-sveltekit-cloudflare/client'
// or
// import { clientInit } from '@jill64/sentry-sveltekit-cloudflare'
import * as Sentry from "@sentry/svelte";

const onError = init(
    'https://485a49edf664c4bad08c2ab0bf87a8eb@o4507622077169664.ingest.de.sentry.io/4507622079660112'
    // ,
    // {
    //   sentryOptions: {
    //     // ... Other Sentry Config
    //   },
    //   enableInDevMode: boolean (default: false)
    // }
)

export const handleError = onError((e, sentryEventId) => {
    Sentry.captureException(e);
})