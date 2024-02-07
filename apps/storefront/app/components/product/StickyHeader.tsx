import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  productTitle: string;
  sections?: []; // type?
};

export default function StickyProductHeader({ productTitle, sections }: Props) {
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

  /** Scrolls to section */
  const handleClickEvent = (event: Event, target: string) => {
    event.preventDefault();

    const element = document.getElementById(target);

    if (element) {
      const yOffset = stickHeader ? -120 : -60;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div
      className={clsx([
        "sticky-product-header",
        stickHeader ? "--is-stuck" : "",
      ])}
      ref={headerElement}
    >
      <div className="content-wrapper">
        <p className="product-title bold-24">{productTitle}</p>
        <div className="sub-navigation-links">
          {sections.map((section) => (
            <a
              className="section-link semi-bold-16"
              href={`#${section.target}`}
              key={section.target}
              onClick={(e) => handleClickEvent(e, section.target)}
            >
              {section.label}
            </a>
          ))}

          <button
            className="section-link semi-bold-16 button--small"
            key={"buy-button"}
          >
            Customise
          </button>
        </div>
      </div>
    </div>
  );
}
