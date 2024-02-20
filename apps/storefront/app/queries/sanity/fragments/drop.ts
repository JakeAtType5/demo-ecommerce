import groq from "groq";

import { EPISODE } from "./episode";
import { IMAGE } from "./image";
import { SEO } from "./seo";

export const DROP = groq`
  _id,
  description,
  title,
  episode -> {
    ${EPISODE}
  },
  location,
  number,
  "previewImage": previewImage {
    ${IMAGE}
  },
  "releaseDate": release_date,
  "slug": "/drop/" + slug.current,
  ${SEO},
`;
