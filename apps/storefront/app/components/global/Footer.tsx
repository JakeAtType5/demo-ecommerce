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
  const { footer } = layout || {};

  return (
    <footer>
      <div className="content-wrapper">
        <div className="footer-logo">
          <p className="bold-24">RFC</p>
          <p className="semi-bold-16">
            Paragraph about what we do. Paragraph about what we do.
          </p>
        </div>
        <div className="footer-menu semi-bold-14">
          <p>Company</p>
          <a>Our story</a>
          <a>Careers</a>
          <a>Blog</a>
          <a>Contact</a>
        </div>
        <div className="footer-menu semi-bold-14">
          <p>Support</p>
          <a>Help with an order</a>
          <a>Shipping</a>
          <a>Returns</a>
          <a>Terms & Conditions</a>
        </div>

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
      </div>
    </footer>
  );
}

/* {menuLinks && (
        <Navigation
          menuLinks={menuLinks}
          className="footer-menu"
        />
      )} */
