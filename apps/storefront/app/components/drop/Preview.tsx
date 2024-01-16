import {
  faCalendarDays,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { SanityDrop } from "~/lib/sanity";

import { formatDate } from "../../lib/utils";

type Props = {
  drop: SanityDrop;
  sectionTitle?: string;
};

export default function DropPreview({ drop, sectionTitle }: Props) {
  const formattedDate = formatDate({
    value: drop.release_date,
    format: "do m y",
  });

  return (
    <div className="drop-preview">
      <div className="drop-content">
        {sectionTitle && (
          <p className="semi-bold-24 section-header">{sectionTitle}</p>
        )}

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

        <button className="button--small semi-bold-16">watch the drop</button>
      </div>

      <VideoPlayer
        size={"preview"}
        file={}
        autoPlayOnEntry={"muted"}
      ></VideoPlayer>

      <div className="video-player"></div>
    </div>
  );
}
