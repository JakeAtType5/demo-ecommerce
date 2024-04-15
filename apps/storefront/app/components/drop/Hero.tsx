import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useState } from "react";

import { Link } from "~/components/Link";
import type { SanityDrop } from "~/lib/sanity";
import { useRootLoaderData } from "~/root";

import VideoPlayerPreview from "../video/PreviewPlayer";
import DropMetadata from "./Metadata";
import SanityImage from "../media/SanityImage";

type Props = {
  drop: SanityDrop;
};

export default function DropHero({ drop }: Props) {
  const { sanityDataset, sanityProjectID } = useRootLoaderData();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className={clsx("drop-hero", isPlaying && "--is-playing")}>
      <div className="drop-image">
        <SanityImage
          dataset={sanityDataset}
          layout="responsive"
          projectId={sanityProjectID}
          sizes={["100vw"]}
          src={drop.previewImage?.asset?._ref}
        />
      </div>

      <FontAwesomeIcon icon={faPlay} />

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
            <p className="semi-bold-32">Video not found</p>
          </div>
        )}
      </div>
      <div className="drop-content">
        <p className="drop-title bold-56">{drop.title}</p>
        <div>
          {drop.description && (
            <p className="semi-bold-16 drop-description">{drop.description}</p>
          )}
          <DropMetadata
            location={drop.location}
            number={drop.number}
            releaseDate={drop?.releaseDate}
          />
        </div>
      </div>
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
