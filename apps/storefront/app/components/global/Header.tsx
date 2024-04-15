import { useContext, useState } from "react";

import HeaderActions from "~/components/global/HeaderActions";
import HeaderBackground from "~/components/global/HeaderBackground";
import MobileNavigation from "~/components/global/MobileNavigation";
import Navigation from "~/components/global/Navigation";
import { useRootLoaderData } from "~/root";

import { NavigationStateContext } from "./NavigationStateWrapper";

/**
 * A server component that specifies the content of the header on the website
 */
export default function Header() {
  const { layout } = useRootLoaderData();
  const { menuLinks } = layout || {};
  const { navIsOpen, openNav, closeNav } = useContext(NavigationStateContext);

  return (
    <header className="navigation-bar" role="banner">
      <div className="content-wrapper">
        {menuLinks && (
          <Navigation
            menuLinks={menuLinks}
            className="desktop-only desktop-navigation navigation-links"
          />
        )}
        {menuLinks && (
          <MobileNavigation
            menuLinks={menuLinks}
            open={navIsOpen}
            onOpen={openNav}
            onClose={closeNav}
          />
        )}

        <p className="bold-24 rfc-logo">Ready.</p>

        {/* Accounts, country selector + cart toggle */}
        <HeaderActions />
      </div>
    </header>
  );
}
