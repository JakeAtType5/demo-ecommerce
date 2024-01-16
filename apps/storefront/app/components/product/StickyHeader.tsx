import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

type Props = {
  sections?: []; // type?
};

export default function StickyProductHeader({ sections }: Props) {
  const [stickHeader, setStickHeader] = useState(false);
  const headerElement = useRef(null);
  const headerElementYPos = headerElement?.current?.offsetTop;

  /* Ensures element is always visible */
  const handleScroll = () => {
    setStickHeader(window.scrollY > headerElementYPos);
    console.log('no I don');
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Trigger handler on mount to account for reloads
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
