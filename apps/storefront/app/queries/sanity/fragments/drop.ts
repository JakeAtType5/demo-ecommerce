import groq from "groq";

import { IMAGE } from "./image";
import { SEO } from "./seo";
import { VIDEO } from "./video";

export const DROP = groq`
  _id,
  description,
  title,
  location,
  number,
  "previewImage": previewImage {
    ${IMAGE}
  },
  "releaseDate": release_date,
  "slug": "/drop/" + slug.current,
  ${SEO},
  "video": video {
    ${VIDEO}
  }
`;
