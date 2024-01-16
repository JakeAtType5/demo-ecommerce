import groq from "groq";

import { CUSTOM_PRODUCT_OPTIONS } from "../customProductOptions";
import { DROP } from "../drop";
import { IMAGE } from "../image";
import { PORTABLE_TEXT } from "../portableText/portableText";
import { PRODUCT_FAQS } from "../productFaqs";
import { SEO_SHOPIFY } from "../seoShopify";
import { SHARED_TEXT } from "../sharedText";

export const PRODUCT_PAGE = groq`
  _id,
  "available": !store.isDeleted && store.status == 'active',
  "body": coalesce(body[_key == $language][0].value, body[_key == $baseLanguage][0].value)[] {
    ${PORTABLE_TEXT}
  },
  description,
  drop->{
    ${DROP}
  },
  ${PRODUCT_FAQS},
  maxUnits,
  "printImage": printImage {
    ${IMAGE}
  },
  "customProductOptions": *[_type == 'settings' && _id == 'settings-' + $language][0].customProductOptions[] {
    ${CUSTOM_PRODUCT_OPTIONS}
  },
  "gid": store.gid,
  story[]{
    ${PORTABLE_TEXT}
  },
  ${SEO_SHOPIFY},
  "slug": store.slug.current,
  ${SHARED_TEXT},
`;

// export const PRODUCT_PAGE = groq`
//   "body": coalesce(body[_key == $language][0].value, body[_key == $baseLanguage][0].value)[] {
//     ${PORTABLE_TEXT}
//   },
//   creators[]{
//     ${CREATOR}
//   },
// `;
