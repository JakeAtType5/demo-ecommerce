import { Link } from "~/components/Link";
import type { SanityDrop } from "~/lib/sanity";

import VideoPlayerPreview from "../video/PreviewPlayer";
import DropMetadata from "./Metadata";

type Props = {
  drop: SanityDrop;
};

export default function DropPreview({ drop }: Props) {
  return (
    <div className="drop-preview">
      <div className="drop-content">
        <p className="drop-title bold-56">{drop.title}</p>

        <DropMetadata
          location={drop.location}
          number={drop.number}
          releaseDate={drop.release_date}
        />

        {drop.description && (
          <p className="semi-bold-16 drop-description">{drop.description}</p>
        )}

        <Link to={drop.slug}>
          <button className="button--small semi-bold-16">
            watch the full drop
          </button>
        </Link>
      </div>

      {drop?.episode?.playbackId ? (
        <VideoPlayerPreview
          playbackId={drop.episode.playbackId}
          assetId={drop.episode.assetId}
          duration={drop.episode.duration}
          // startTime
        />
      ) : (
        <div className="video-empty-state">
          <p className="semi-bold-32">Coming soon</p>
        </div>
      )}
    </div>
  );
}
