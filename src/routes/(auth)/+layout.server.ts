import { redirect } from "sveltekit-flash-message/server";
import type { LayoutServerLoad } from "./$types.ts";

export const ssr = true;

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession },
  cookies,
  url,
}) => {
  // depends("supabase:auth");
  const { session } = await safeGetSession();

  if (
    session &&
    url.pathname.includes("/sign-up") &&
    url.searchParams.get("role") === "teacher"
  )
    redirect(
      303,
      `/account`,
      {
        message: `Du är redan inloggad. Om du vill skapa konto som lärare, logga ut först.`,
        type: "info",
      },
      cookies,
    );

  if (session)
    redirect(
      303,
      "/account",
      {
        message: `Du är redan inloggad.`,
        type: "info",
      },
      cookies,
    );
};
