import { PUBLIC_ENVIRONMENT } from "$env/static/public";
import * as Sentry from "@sentry/sveltekit";

export const logError = (options: { error?: unknown, message: string, additionalData?: Record<string, unknown>, critical?: boolean }): string => {
    let { additionalData } = options;
    if (options.critical) {
        if (additionalData) additionalData.critical = true;
        else additionalData = { critical: true };
    }

    if (handleLocalLog({ error: options.error, additionalData })) return crypto.randomUUID();
    return Sentry.captureException(options.error, { extra: { ...(additionalData && additionalData) } });
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