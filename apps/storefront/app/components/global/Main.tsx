import clsx from "clsx";
import { useContext } from "react";

import { CartStateContext } from "~/components/global/CartStateWrapper";

export default function Main({ children }) {
  const { isOpen, closeDrawer } = useContext(CartStateContext);

  return (
    <div
      className={clsx(isOpen && "--cart-is-open", "content-wrapper")}
      onClick={closeDrawer}
    >
      <main role="main">{children}</main>
    </div>
  );
}
