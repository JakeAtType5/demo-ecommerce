import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";

import HeaderActions from "~/components/global/HeaderActions";
import HeaderBackground from "~/components/global/HeaderBackground";
import ExpandedNavigation from "~/components/global/ExpandedNavigation";
import Navigation from "~/components/global/Navigation";
import { Link } from "~/components/Link";
import { useRootLoaderData } from "~/root";

import { NavigationStateContext } from "./NavigationStateWrapper";

/**
 * A server component that specifies the content of the header on the website
 */
export default function Header() {
  const { layout } = useRootLoaderData();
  const { topLevelLinks, expandedLinks } = layout || {};
  const { navIsOpen, openNav, closeNav } = useContext(NavigationStateContext);

  return (
    <header className="navigation-bar" role="banner">
      <div className="content-wrapper">
        <div className="desktop-only navigation-container">
          {topLevelLinks && (
            <Navigation
              menuLinks={topLevelLinks}
              className="navigation-links"
            />
          )}
          <FontAwesomeIcon icon={faEllipsisH} onClick={openNav} />
        </div>

        <Link to={"/index"} key={"logo"}>
          <p className="bold-24 rfc-logo">Ready.</p>
        </Link>

        {/* Accounts, country selector + cart toggle */}
        <HeaderActions />

        {expandedLinks && (
          <ExpandedNavigation
            menuLinks={expandedLinks}
            open={navIsOpen}
            onOpen={openNav}
            onClose={closeNav}
          />
        )}
      </div>
    </header>
  );
}
