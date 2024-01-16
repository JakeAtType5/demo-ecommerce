import { createRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import type { SanityVideo } from "~/lib/sanity";

import VideoPlayer from "./VideoPlayer";

export default function VideoPlayerPreview(video: SanityVideo) {
  const autoplayVideo = {
    ...video,
    ...{
      autoPlay: "muted",
      theme: "microvideo",
    },
  };

  const playerReference = createRef();

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      playerReference && playerReference.current
        ? playerReference.current.play()
        : "";
    }
  }, [inView, playerReference]);

  return (
    <div className="video-player" ref={ref}>
      <VideoPlayer
        playbackId={video.playbackId}
        assetId={video.assetId}
        duration={video.duration}
        muted={true}
        theme="microvideo"
        playerReference={playerReference}
      />
    </div>
  );
}
