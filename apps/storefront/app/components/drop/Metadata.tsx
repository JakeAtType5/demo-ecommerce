import {
  faCalendarDays,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { formatDate } from "../../lib/utils";

type Props = {
  location?: string;
  number?: number;
  releaseDate?: string;
};

export default function DropMetadata({ location, number, releaseDate }: Props) {
  const formattedDate =
    releaseDate && formatDate({
      value: releaseDate,
      format: "do m y",
    });

  return (
    <div className="drop-metadata semi-bold-16">
      {number && <p>Drop #{number}</p>}

      {location && (
        <div className="metadata-with-icon">
          <FontAwesomeIcon icon={faLocationDot} />
          <p>{location}</p>
        </div>
      )}

      {releaseDate && (
        <div className="metadata-with-icon">
          <FontAwesomeIcon icon={faCalendarDays} />
          <p>{formattedDate}</p>
        </div>
      )}
    </div>
  );
}
