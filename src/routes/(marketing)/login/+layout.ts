export const load = async ({ data }) => {
  const url = data.url;
  return { url: data.url };  // todo: available in parent? No need to return here?
};
