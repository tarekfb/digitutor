import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({
  url,
  locals: { session },
}) => {

  return {
    session,
    url: url.origin,
  };
};
