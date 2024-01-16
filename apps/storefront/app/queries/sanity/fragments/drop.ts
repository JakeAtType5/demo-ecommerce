import groq from "groq";

import { SEO_SHOPIFY } from "./seoShopify";

export const DROP = groq`
  drop->{
    title,
    number,
    description,
    release_date,
    location,
    "slug": "/drops/" + slug.current,
    ${SEO_SHOPIFY}
  }
`;
