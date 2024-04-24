import groq from "groq";

import { MARK_DEFS } from "~/queries/sanity/fragments/portableText/markDefs"

import { SEO } from "../seo";

export const HOME_PAGE = groq`
  "faqs": faqs[]{
    _key,
    "title": question,
    "body": answer[] {
      ...,
      markDefs[] {
        ${MARK_DEFS}
      }
    }
  },
  "title": heroTitle,
  ${SEO}
`;
