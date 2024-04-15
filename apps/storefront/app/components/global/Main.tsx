import clsx from "clsx";
import { useContext } from "react";

import { CartStateContext } from "~/components/global/CartStateWrapper";

import { NavigationStateContext } from "./NavigationStateWrapper";

export default function Main({ children }) {
  const { cartIsOpen, closeDrawer } = useContext(CartStateContext);
  const { navIsOpen } = useContext(NavigationStateContext);

  return (
    <div
      className={clsx(
        cartIsOpen && "--cart-is-open",
        navIsOpen && "--nav-is-open",
        "content-wrapper"
      )}
      onClick={closeDrawer}
    >
      <main role="main">{children}</main>
    </div>
  );
}
