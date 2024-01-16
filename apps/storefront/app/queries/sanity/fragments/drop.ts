import groq from "groq";

import { EPISODE } from "./episode";
import { SEO } from "./seo";

export const DROP = groq`
  title,
  episode -> {
    ${EPISODE}
  },
  number,
  description,
  release_date,
  location,
  "slug": "/drops/" + slug.current,
  ${SEO},
`;
