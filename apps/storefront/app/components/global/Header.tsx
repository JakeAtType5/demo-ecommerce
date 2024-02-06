import { useState } from "react";

import HeaderActions from "~/components/global/HeaderActions";
import HeaderBackground from "~/components/global/HeaderBackground";
import MobileNavigation from "~/components/global/MobileNavigation";
import Navigation from "~/components/global/Navigation";
import { useRootLoaderData } from "~/root";

/**
 * A server component that specifies the content of the header on the website
 */
export default function Header() {
  const { layout } = useRootLoaderData();
  const { menuLinks, footer } = layout || {};

  // return (
  //   <header
  //     className={clsx(
  //       "align-center fixed top-0 z-40 flex h-header-sm w-full px-4",
  //       "md:px-8",
  //       "lg:h-header-lg"
  //     )}
  //     role="banner"
  //   >
  //     <HeaderBackground />
  //     {menuLinks && <MobileNavigation menuLinks={menuLinks} />}
  //     {menuLinks && <Navigation menuLinks={menuLinks} />}
  //     {/* Accounts, country selector + cart toggle */}
  //     <HeaderActions />
  //   </header>
  // );

  return (
    <header className="navigation-bar" role="banner">
      <p className="bold-24 rfc-logo">mono.</p>

      {/* <NavigationTabs /> */}
      {menuLinks && (
        <Navigation
          menuLinks={menuLinks}
          className="desktop-only desktop-navigation"
        />
      )}
      {menuLinks && (
        <MobileNavigation menuLinks={[...menuLinks, ...footer.links]} />
      )}

      {/* Accounts, country selector + cart toggle */}
      <HeaderActions />
    </header>
  );
}
