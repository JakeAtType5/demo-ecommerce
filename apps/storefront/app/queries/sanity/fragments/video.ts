import groq from "groq";

export const VIDEO = groq`
  "playbackId": asset->playbackId,
  "assetId": asset->assetId,
  "aspectRatio": asset->data.aspect_ratio,
  "duration": asset->data.duration,
`;
