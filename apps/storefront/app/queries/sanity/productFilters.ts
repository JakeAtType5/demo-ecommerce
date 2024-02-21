import groq from "groq";

export const STYLES_FOR_PRODUCT_QUERY = groq`
*[_type == "style"] {
  title,
  _id,
  "slug": slug.current,
  
  "count": count(*[_type == "product" && references(^._id)])
}
`;

export const COLOURS_FOR_PRODUCT_QUERY = groq`
*[_type == "colour"] {
  title,
  _id,
  "slug": slug.current,
  "count": count(*[_type == "product" && references(^._id)])
}
`;

export const STYLES_FOR_DROP_QUERY = groq`
*[_type == "style"] {
  title,
  _id,
  "slug": slug.current,
  "count": count(*[_type == "drop" && references(^._id)])
}
`;

export const LOCATIONS_FOR_DROP_QUERY = groq`
*[_type == "location"] {
  title,
  _id,
  "slug": slug.current,
  "count": count(*[_type == "drop" && references(^._id)])
}
`;
