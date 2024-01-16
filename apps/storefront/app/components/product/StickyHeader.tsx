import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  sections?: []; // type?
};

export default function StickyProductHeader({ sections }: Props) {
  /* Sticks header when it is no longer in the viewport */
  const [stickHeader, setStickHeader] = useState(false);
  const headerElement = useRef();

  const handleScroll = useCallback(() => {
    const headerElementYPos = headerElement?.current?.offsetTop;
    setStickHeader(window.scrollY > headerElementYPos);
  }, [headerElement]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Trigger handler on mount to account for reloads
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
          Buy now
        </button>
      </div>
    </div>
  );
}
