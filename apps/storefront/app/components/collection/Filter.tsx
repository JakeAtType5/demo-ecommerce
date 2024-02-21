import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

import type { SanityFilter } from "~/lib/sanity";

type Props = {
  items?: SanityFilter[];
  isExpanded?: boolean;
  onClickHeading?: () => void;
  title: string;
};

export default function Filter({
  items,
  isExpanded,
  onClickHeading,
  title,
}: Props) {
  return (
    <div className={clsx("filter", isExpanded && "--is-expanded")}>
      <button className="filter-heading" onClick={(e) => onClickHeading(e)}>
        {title} <FontAwesomeIcon icon={faAngleDown} />
      </button>
      {items && (
        <div className="filter-dropdown">
          {items.map((item) => (
            <div
              key={item.slug}
              className={item.count == 0 ? "--is-disabled" : ""}
            >
              <input type="checkbox" />
              <p className="semi-bold-16">
                {item.title} ({item.count})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
