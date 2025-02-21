import { PostHog } from 'posthog-node'
import { POSTHOG_API_KEY } from "$env/static/private"
import { PUBLIC_ENVIRONMENT } from '$env/static/public'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- okay usage of any, unknown values
export const captureEvent = async (event: string, error?: unknown, trackingId?: string, distinctId: string = "", data?: Record<string | number, any>): Promise<void> => {
    /*
    https://posthog.com/docs/product-analytics/capture-events?tab=Node.js
    Tip:
        We recommend using a [object] [verb] format for your event names, 
        where [object] is the entity that the behavior relates to,
        and [verb] is the behavior itself. 
        For example, project created, user signed up, or invite sent.
    */

    // if (PUBLIC_ENVIRONMENT === "local") return;

    try {
        const errorProperties = error ? {
            error: {
                message: error instanceof Error ? error.message : String(error),
                name: error instanceof Error ? error.name : 'Unknown',
                stack: error instanceof Error ? error.stack : undefined,
                // Convert error to string representation
                toString: String(error)
            }
        } : {}
    
        const client = new PostHog(
            POSTHOG_API_KEY,
            { host: 'https://eu.i.posthog.com' }
        )
    
        client.capture({
            distinctId,
            event,
            properties: {
                environment: PUBLIC_ENVIRONMENT,
                ...(trackingId && { trackingId }),
                ...data,
                ...errorProperties
            },
        })
    
    
        await client.shutdown()
    } catch (error) {
        console.error(`Error while manually capturing event`, error)
    }
}