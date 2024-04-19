import groq from "groq";

import { PORTABLE_TEXT } from "./portableText/portableText";
import { SEO } from "./seo";
import { VIDEO } from "./video";

export const DROP = groq`
  _id,
  credits[]{
    ${PORTABLE_TEXT}
  },
  description,
  gallery[]{
    ${PORTABLE_TEXT}
  },
  location,
  number,
  notes[]{
    ${PORTABLE_TEXT}
  },
  message,
  "releaseDate": release_date,
  "slug": "/drop/" + slug.current,
  ${SEO},
  title,
  "video": video {
    ${VIDEO}
  }
`;
