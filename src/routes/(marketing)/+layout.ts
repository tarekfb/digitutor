export const load = async ({ data }) => {
  return { profile: data.profile, listings: data.listings };  // todo: available in parent? No need to return here?
};
