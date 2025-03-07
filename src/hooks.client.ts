import { PUBLIC_ENVIRONMENT } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';
import { handleErrorWithSentry } from '@sentry/sveltekit';

Sentry.init({
    dsn: 'https://485a49edf664c4bad08c2ab0bf87a8eb@o4507622077169664.ingest.de.sentry.io/4507622079660112',
    environment: PUBLIC_ENVIRONMENT,
    enabled: PUBLIC_ENVIRONMENT !== "local",
    tracesSampleRate: 1.0,
    // For instance, initialize Session Replay:
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.replayIntegration()],
});


export const handleError = handleErrorWithSentry();
// or alternatively, if you don't have a custom error handler:
// export const handleError = handleErrorWithSentry();