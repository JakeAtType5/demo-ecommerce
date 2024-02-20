import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { SanityFilter } from "~/lib/sanity";

type Props = {
  items?: SanityFilter[];
  isExpanded?: boolean;
  onClick?: () => void;
  title: string;
};

export default function Filter({ items, isExpanded, onClick, title }: Props) {
  return (
    <div className="filter">
      <div className="filter-heading">
        {title} <FontAwesomeIcon icon={faAngleDown} />
      </div>
      {items && (
        <div className="filter-dropdown">
          {items.map((item) => (
            <div key={item.slug}>
              <p className="semi-bold-14">{item.title}</p>
              <p className="semi-bold-14">{item.count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
