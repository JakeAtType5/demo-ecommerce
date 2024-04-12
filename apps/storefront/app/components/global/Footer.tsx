import {
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Navigation from "~/components/global/Navigation";
import { useRootLoaderData } from "~/root";

/**
 * A server component that specifies the content of the footer
 */
export default function Footer() {
  const { layout } = useRootLoaderData();
  const { companyLinks, supportLinks } = layout || {};

  return (
    <footer>
      <div className="footer-logo">
        <p className="bold-24">RFC</p>
        <p className="semi-bold-16">
          Paragraph about what we do. Paragraph about what we do.
        </p>
      </div>

      {companyLinks && (
        <Navigation
          menuLinks={companyLinks}
          className="footer-menu semi-bold-14"
          title="Company"
        />
      )}

      {supportLinks && (
        <Navigation
          menuLinks={supportLinks}
          className="footer-menu semi-bold-14"
          title="Support"
        />
      )}

      <div className="footer-bar">
        <p className="semi-bold-14">
          Copyright 2024 Ready For Collection. All rights reserved.
        </p>
        <div className="social-links">
          <FontAwesomeIcon icon={faInstagram} />
          <FontAwesomeIcon icon={faTiktok} />
          <FontAwesomeIcon icon={faYoutube} />
        </div>
      </div>
    </footer>
  );
}
