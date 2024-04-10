// takes an array of slugs and matches them against the provided options object
// this is used to exchange data references between sanity + shopify references
export const getSanityIDsFromSlugs = (slugs, data) => {
  if (!slugs || !data) {
    return [];
  }

  return data.filter((x) => slugs.includes(x.slug)).map((x) => x._id);
};
