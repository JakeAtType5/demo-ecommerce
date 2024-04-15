import { faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Await } from "@remix-run/react";
import { CartForm } from "@shopify/hydrogen";
import { Cart } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import { useContext, useEffect } from "react";

import { CartDrawer } from "~/components/cart/CartDrawer";
import CartToggle from "~/components/cart/CartToggle";
import { CartStateContext } from "~/components/global/CartStateWrapper";
import { CountrySelector } from "~/components/global/CountrySelector";
import { Link } from "~/components/Link";
import { useCartFetchers } from "~/hooks/useCartFetchers";
import { useRootLoaderData } from "~/root";

export default function HeaderActions() {
  const { cartIsOpen, openDrawer, closeDrawer } = useContext(CartStateContext);

  const { cart, sanityCartResults } = useRootLoaderData();

  // Grab all the fetchers that are adding to cart
  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // When the fetchers array changes, open the drawer if there is an add to cart action
  useEffect(() => {
    if (
      addToCartFetchers[0] &&
      addToCartFetchers[0].state === "loading" &&
      addToCartFetchers[0]?.data?.errors.length === 0
    )
      openDrawer();
    return;
  }, [addToCartFetchers, openDrawer]);

  return (
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
      <Await resolve={cart}>
        {(cart) => (
          <>
            <CartToggle
              cart={cart as Cart}
              isOpen={cartIsOpen}
              openDrawer={openDrawer}
              closeDrawer={closeDrawer}
            />

            <CartDrawer
              cart={cart as Cart}
              open={cartIsOpen}
              onClose={closeDrawer}
              sanityCartResults={sanityCartResults}
            />
          </>
        )}
      </Await>
    </div>
  );
}
