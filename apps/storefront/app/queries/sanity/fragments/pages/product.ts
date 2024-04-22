import groq from "groq";

import { CUSTOM_PRODUCT_OPTIONS } from "../customProductOptions";
import { DROP } from "../drop";
import { IMAGE } from "../image";
import { PORTABLE_TEXT } from "../portableText/portableText";
import { PRODUCT_FAQS } from "../productFaqs";
import { SEO_SHOPIFY } from "../seoShopify";
import { SHARED_TEXT } from "../sharedText";

export const PRODUCT_PREVIEW = groq`
  _id,
  "artist": store.vendor,
  "artwork": printImage {
    ${IMAGE}
  },
  description,
  "gid": store.gid,
  maxUnits,
  "priceRange": store.priceRange,
  "releaseDate": drop->release_date,
  "slug": "/product/" + store.slug.current,
  "title": store.title,
`;

export const PRODUCT_PAGE = groq`
  _id,
  "artist": store.vendor,
  "artwork": printImage {
    ${IMAGE}
  },
  bundles[]->{
    "gid": store.gid
  },
  description,
  drop->{
    ${DROP}
  },
  ${PRODUCT_FAQS},
  gallery[]{
    ${PORTABLE_TEXT}
  },
  "gid": store.gid,
  maxUnits,
  notes[]{
    ${PORTABLE_TEXT}
  },
  "priceRange": store.priceRange,
  ${SEO_SHOPIFY},
  "slug": "/product/" + store.slug.current,
  ${SHARED_TEXT},
`;
