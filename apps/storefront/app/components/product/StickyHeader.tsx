import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

import { scrollToElement } from "../../lib/utils";

type Props = {
  isInStock: boolean;
  isFutureRelease?: boolean;
  onCustomiseClick: () => void;
  productTitle: string;
  sections?: []; // type?
};

export default function StickyProductHeader({
  isInStock,
  isFutureRelease,
  onCustomiseClick,
  productTitle,
  sections,
}: Props) {
  const [expandMobileMenu, setExpandMobileMenu] = useState(false);

  /* Sticks header when it is no longer in the viewport */
  const [stickHeader, setStickHeader] = useState(false);
  const [headerYPos, setHeaderYPos] = useState(false);

  const headerElement = useRef();

  const handleScroll = useCallback(() => {
    setStickHeader(headerYPos ? window.scrollY > headerYPos : false);
  }, [headerYPos]);

  useEffect(() => {
    if (!headerYPos) {
      setHeaderYPos(headerElement?.current?.offsetTop);
    }

    // Trigger handler on mount to account for reloads
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, headerYPos]);

  /* Toggles mobile overflow menu */
  const toggleMobileMenu = () => {
    if (expandMobileMenu) {
      setExpandMobileMenu(false);
    } else {
      setExpandMobileMenu(true);
    }
  };

  return (
    <div
      className={clsx([
        "sticky-product-header",
        stickHeader ? "--is-stuck" : "",
        expandMobileMenu ? "--with-expanded-menu" : "",
      ])}
      ref={headerElement}
    >
      <div className="content-wrapper">
        <p className="product-title bold-24" onClick={() => toggleMobileMenu()}>
          {productTitle}
          <FontAwesomeIcon icon={faAngleDown} />
        </p>
        <div className="sub-navigation-links">
          {sections.map((section) => (
            <a
              className="section-link semi-bold-16"
              href={`#${section.target}`}
              key={section.target}
              onClick={(e) => scrollToElement(e, section.target)}
            >
              {section.label}
            </a>
          ))}
        </div>

        {isInStock && !isFutureRelease && (
          <button
            className="section-link semi-bold-16 button--small"
            onClick={(e) => onCustomiseClick()}
          >
            Customise
          </button>
        )}
      </div>
    </div>
  );
}
