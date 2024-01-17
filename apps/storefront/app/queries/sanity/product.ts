import groq from "groq";

import { PRODUCT_PAGE, PRODUCT_PREVIEW } from "./fragments/pages/product";

export const PRODUCT_PAGE_QUERY = groq`
  *[
    _type == 'product'
    && store.slug.current == $slug
  ] | order(_updatedAt desc) [0]{
    ${PRODUCT_PAGE}
  }
`;

export const PRODUCTS_IN_DROP_QUERY = groq`
  *[
    _type == 'drop'
    && _id == $dropId
  ] | order(_updatedAt desc) [0]{
    "prints": prints[]->{
      ${PRODUCT_PREVIEW}
    }
  }
`;
