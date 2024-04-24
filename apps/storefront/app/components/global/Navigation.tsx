import clsx from "clsx";
import { useCallback } from "react";

import CollectionGroup from "~/components/global/collectionGroup/CollectionGroup";
import { Link } from "~/components/Link";
import type { SanityMenuLink } from "~/lib/sanity";

/**
 * A component that defines the navigation for a web storefront
 */

type Props = {
  className?: string;
  menuLinks: SanityMenuLink[];
  title?: string;
};

export default function Navigation({ className, menuLinks, title }: Props) {
  const renderLinks = useCallback(() => {
    return menuLinks?.map((link) => {
      if (link._type === "collectionGroup") {
        return <CollectionGroup collectionGroup={link} key={link._key} />;
      }

      if (link._type === "linkExternal" && link.url[0] === "/") {
        // relative links
        return (
          <Link to={link.url} key={link._key}>
            {link.title}
          </Link>
        );
      }

      if (link._type === "linkExternal" && link?.url[0] !== "/") {
        // true external links
        return (
          <a
            key={link._key}
            href={link.url}
            rel="noreferrer"
            target={link.newWindow ? "_blank" : "_self"}
          >
            {link.title}
          </a>
        );
      }

      if (link._type === "linkInternal") {
        // if (!link.slug) {
        //   return null;
        // }

        return (
          // <Link className="" to={link.slug} key={link._key}>
          <Link className="" to="/account/login" key={link._key}>
            {link.title}
          </Link>
        );
      }

      if (link._type === "separator") {
        return <div key={link._key} className="separator" />;
      }

      return null;
    });
  }, [menuLinks]);

  return (
    <nav className={className}>
      {title && <p>{title}</p>}
      {renderLinks()}
    </nav>
  );
}
