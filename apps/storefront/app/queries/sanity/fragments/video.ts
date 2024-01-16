import groq from "groq";

export const VIDEO = groq`
  "playbackId": video.asset->playbackId,
  "assetId": video.asset->assetId,
  "aspectRatio": video.asset->data.aspect_ratio,
  "duration": video.asset->data.duration,
`;
