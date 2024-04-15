import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Await } from "@remix-run/react";
import { Cart } from "@shopify/hydrogen/storefront-api-types";
import { Suspense, useContext } from "react";
import { NavigationStateContext } from "../global/NavigationStateWrapper";

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
  const { navIsOpen, closeNav } = useContext(NavigationStateContext);

  const toggleCart = () => {
    if (navIsOpen) {
      // first close cart drawer
      closeNav();
      // then open navigation
      openDrawer();
    } else {
      // no cart to consider, so we just toggle
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    }
  };

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
            onClick={toggleCart}
          >
            {data?.totalQuantity || 0}
          </FontAwesomeIcon>
        )}
      </Await>
    </Suspense>
  );
}
