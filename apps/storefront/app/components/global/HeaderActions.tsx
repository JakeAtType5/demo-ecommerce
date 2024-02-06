import {
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Await } from "@remix-run/react";
import { CartForm } from "@shopify/hydrogen";
import { Cart } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import { useEffect } from "react";

import { CartDrawer, useDrawer } from "~/components/cart/CartDrawer";
import CartToggle from "~/components/cart/CartToggle";
import { CountrySelector } from "~/components/global/CountrySelector";
import { Link } from "~/components/Link";
import { useCartFetchers } from "~/hooks/useCartFetchers";
import { useRootLoaderData } from "~/root";

export default function HeaderActions(navIsOpen: boolean) {
  const { isOpen, openDrawer, closeDrawer } = useDrawer();
  const { cart } = useRootLoaderData();

  // Grab all the fetchers that are adding to cart
  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // When the fetchers array changes, open the drawer if there is an add to cart action
  useEffect(() => {
    if (
      isOpen ||
      addToCartFetchers.length === 0 ||
      addToCartFetchers[0].state === "submitting"
    )
      return;
    // openDrawer();
  }, [addToCartFetchers, isOpen, openDrawer]);

  return (
    <>
      <div className="navigation-actions">
        {/* Country select
        <div
          className={clsx(
            "hidden", //
            "lg:block"
          )}
        >
          <CountrySelector />
        </div> */}

        {/* Search */}
        <FontAwesomeIcon className="desktop-only" icon={faMagnifyingGlass} />

        {/* Account */}
        <Link
          className={clsx([
            "hidden h-[2.4rem] items-center rounded-sm bg-darkGray bg-opacity-0 p-2",
            "lg:flex",
            "hover:bg-opacity-10",
            "mobile-only",
          ])}
          to="/account"
        >
          <FontAwesomeIcon icon={faUser} />
        </Link>

        {/* Cart */}
        <div className="ml-2 mr-4 flex h-full items-center justify-center py-4">
          <Await resolve={cart}>
            {(cart) => (
              <CartToggle
                cart={cart as Cart}
                isOpen={isOpen}
                openDrawer={openDrawer}
              />
            )}
          </Await>
        </div>
      </div>

      <Await resolve={cart}>
        {(cart) => (
          <CartDrawer
            cart={cart as Cart}
            open={isOpen}
            onClose={closeDrawer}
          />
        )}
      </Await>
    </>
  );
}
