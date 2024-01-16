import "@mux/mux-player/themes/microvideo";
import "@mux/mux-player/themes/classic";

import MuxPlayer from "@mux/mux-player-react";

import type { SanityVideo } from "~/lib/sanity";

export default function VideoPlayer(video: SanityVideo) {
  const ENV = "";

  return (
    <MuxPlayer
      style={{ height: "100%", maxWidth: "100%" }}
      playbackId={video.playbackId}
      metadata={{
        video_id: video.assetId,
        video_title: video.title,
        viewer_user_id: "user-id-bc-789", // todo
      }}
      streamType="on-demand"
      envKey={ENV}
      startTime={video.startTime}
      muted={video.muted}
      theme={video.theme ? video.theme : "classic"}
      ref={video.playerReference}
    />
  );
}
