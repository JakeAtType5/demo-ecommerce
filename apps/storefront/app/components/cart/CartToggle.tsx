import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Await } from "@remix-run/react";
import { Cart } from "@shopify/hydrogen/storefront-api-types";
import { Suspense } from "react";

type Props = {
  cart: Cart;
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

/**
 * A client component that defines the behavior when a user toggles a cart
 */
export default function CartToggle({
  cart,
  isOpen,
  openDrawer,
  closeDrawer,
}: Props) {
  // JL: This will need more work to render a count component
  return (
    <Suspense
      fallback={<FontAwesomeIcon icon={faShoppingBag}></FontAwesomeIcon>}
    >
      <Await resolve={cart}>
        {(data) => (
          <FontAwesomeIcon
            className={"cart-toggle"}
            icon={faShoppingBag}
            aria-expanded={isOpen}
            aria-controls="cart"
            onClick={() => {
              !isOpen ? openDrawer() : closeDrawer();
            }}
          >
            {data?.totalQuantity || 0}
          </FontAwesomeIcon>
        )}
      </Await>
    </Suspense>
  );
}
