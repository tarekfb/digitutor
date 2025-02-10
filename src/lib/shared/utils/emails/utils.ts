import { RESEND_API_KEY } from "$env/static/private";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import type { Database } from "src/supabase.ts";
import { render } from "svelty-email";
import { websiteName, noReplyEmail } from "../../constants/constants.ts";

export const getEmailById = async (supabaseServiceRole: SupabaseClient<Database>, id: string): Promise<string> => {
    const { data, error } = await supabaseServiceRole.rpc(
        "get_user_email_by_id",
        {
            id,
        }
    ).maybeSingle() as { data: { email: string }; error: unknown };

    if (error) throw error;

    return data.email;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- svelty-email uses any for render function
export const sendEmail = async (svelteComponentToRender: any, to: string[], subject: string, props: Record<string, any>) => {
    const resend = new Resend(RESEND_API_KEY);
    const html = render({
        template: svelteComponentToRender,
        props
    });
    const { data, error } = await resend.emails.send({
        from: `${websiteName} <${noReplyEmail}>`,
        to,
        subject,
        html
    })

    return { data, error };
}
