import clsx from "clsx";
import { useState } from "react";

import { Link } from "~/components/Link";
import type { SanityDrop } from "~/lib/sanity";
import { useRootLoaderData } from "~/root";

import VideoPlayerPreview from "../video/PreviewPlayer";

type Props = {
  drop: SanityDrop;
  onlyHeader: boolean;
};

export default function DropHero({ drop, onlyHeader = false }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className={clsx("drop-hero", isPlaying && "--is-playing")}>
      <div className="drop-content">
        <div className="drop-title bold-56">
          #{drop.number} {drop.title}
        </div>

        <p className="italic-24">From {drop.location}</p>
        <p className="body-text-18 drop-description">{drop.description}</p>
      </div>

      {!onlyHeader && (
        <div className="drop-video">
          {drop?.video?.playbackId ? (
            <VideoPlayerPreview
              playbackId={drop.video.playbackId}
              assetId={drop.video.assetId}
              duration={drop.video.duration}
              // startTime
            />
          ) : (
            <div className="video-empty-state">
              <p className="semi-bold-32">Episode coming soon...</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// <div className="drop-preview">
// <div className="drop-content">
//   <p className="drop-title bold-56">{drop.title}</p>

//   <DropMetadata
//     location={drop.location}
//     number={drop.number}
//     releaseDate={drop.releaseDate}
//   />

//   {drop.description && (
//     <p className="semi-bold-16 drop-description">{drop.description}</p>
//   )}

//   <Link to={drop.slug}>
//     <button className="button--small semi-bold-16">
//       watch the full drop
//     </button>
//   </Link>
// </div>

// {drop?.video?.playbackId ? (
//   <VideoPlayerPreview
//     playbackId={drop.video.playbackId}
//     assetId={drop.video.assetId}
//     duration={drop.video.duration}
//     // startTime
//   />
// ) : (
//   <div className="video-empty-state">
//     <p className="semi-bold-32">Coming soon</p>
//   </div>
// )}
// </div>
