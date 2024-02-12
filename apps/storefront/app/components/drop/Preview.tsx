import {
  faCalendarDays,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { SanityDrop } from "~/lib/sanity";

import { formatDate } from "../../lib/utils";
import VideoPlayerPreview from "../video/PreviewPlayer";

type Props = {
  drop: SanityDrop;
};

export default function DropPreview({ drop }: Props) {
  const formattedDate = formatDate({
    value: drop.release_date,
    format: "do m y",
  });

  return (
    <div className="drop-preview">
      <div className="drop-content">
        <p className="drop-title bold-56">{drop.title}</p>

        <div className="drop-metadata semi-bold-16">
          {drop.number && <p>Drop #{drop.number}</p>}

          {drop.location && (
            <div className="metadata-with-icon">
              <FontAwesomeIcon icon={faLocationDot} />
              <p>{drop.location}</p>
            </div>
          )}

          {drop.release_date && (
            <div className="metadata-with-icon">
              <FontAwesomeIcon icon={faCalendarDays} />
              <p>{formattedDate}</p>
            </div>
          )}
        </div>

        {drop.description && (
          <p className="semi-bold-16 drop-description">{drop.description}</p>
        )}

        <button className="button--small semi-bold-16">
          watch the full drop
        </button>
      </div>

      <VideoPlayerPreview
        playbackId={drop.episode.playbackId}
        assetId={drop.episode.assetId}
        duration={drop.episode.duration}
        // startTime
      />
    </div>
  );
}
