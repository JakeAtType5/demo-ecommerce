import groq from "groq";

import { DROP } from "./fragments/drop";

export const DROPS_QUERY = groq`
  *[
    _type == "drop"
  ] | order(_createdAt desc) {
    ${DROP}
  }
`;

export const DROP_PAGE_QUERY = groq`
  *[
    _type == 'drop'
    && slug.current == $slug
  ] | order(_updatedAt desc) [0]{
    ${DROP}
  }
`;
