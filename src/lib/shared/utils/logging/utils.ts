import { PUBLIC_ENVIRONMENT } from "$env/static/public";
// import * as Sentry from "@sentry/sveltekit";

export const logErrorServer = (options: { error?: unknown, message: string, additionalData?: Record<string, unknown>, critical?: boolean }): string => {
    return ""; // terminated logging as of 2025-12-17
    
    let { additionalData } = options;
    const {message} = options;
    if (options.critical) {
        if (additionalData) additionalData.critical = true;
        else additionalData = { critical: false };
    }

    if (handleLocalLog({ error: options.error, additionalData, })) return crypto.randomUUID();
    return Sentry.captureException(options.error, { extra: { ...(additionalData && additionalData), message } });
};

const handleLocalLog = (data?: Record<string, unknown>): boolean => {
    if (PUBLIC_ENVIRONMENT === "local") {
        console.error("Error occured in local environment", { data });
        return true;
    }
    return false;
}
