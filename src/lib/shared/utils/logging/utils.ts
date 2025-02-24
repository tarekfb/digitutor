import { PUBLIC_ENVIRONMENT } from "$env/static/public";
import * as Sentry from "@sentry/sveltekit";

export const logError = (error: unknown, additionalData?: Record<string, unknown>): string => {
    if (handleLocalLog({ error, additionalData })) return crypto.randomUUID();
    return Sentry.captureException(error, { extra: { ...(additionalData && additionalData) } });
};

export const logMessage = (message: string, additionalData?: Record<string, unknown>): string => {
    if (handleLocalLog({ message, additionalData })) return crypto.randomUUID();
    return Sentry.captureMessage(message, { extra: { ...(additionalData && additionalData) } });
}

const handleLocalLog = (data?: Record<string, unknown>): boolean => {
    if (PUBLIC_ENVIRONMENT === "local") {
        console.error("Error occured in local environment", { data });
        return true;
    }
    return false;
}