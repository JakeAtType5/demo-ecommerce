import groq from "groq";

export const PRODUCT_WITH_VARIANT_FIELDS = groq`
  _id,
  "_type": "productWithVariant",
  "gid": store.gid,
  "slug": store.slug.current,
  "variantGid": coalesce(^.variant->store.gid, store.variants[0]->store.gid)
`;
