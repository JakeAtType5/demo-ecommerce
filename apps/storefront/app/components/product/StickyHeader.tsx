import clsx from "clsx";
import { useEffect, useState } from "react";

import { Link } from "../Link";

type Props = {
  isVisible?: boolean;
  sections?: []; // type?
};

export default function StickyProductHeader({ isVisible, sections }: Props) {
  const [scrolledDown, setScrolledDown] = useState(false);

  const handleScroll = () => {
    setScrolledDown(window.scrollY > window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Trigger handler on mount to account for reloads
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClickEvent = (event: Event, target: string) => {
    event.preventDefault();

    const element = document.getElementById(target);

    if (element) {
      const yOffset = -60;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div
      className={clsx([
        "sticky-product-header",
        scrolledDown ? "--is-visible" : "",
      ])}
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
