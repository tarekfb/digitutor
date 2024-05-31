import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({
  url,
  locals: { getSession },
}) => {
  const session = await getSession();

  return {
    session: session,
    url: url.origin,
  };
};
