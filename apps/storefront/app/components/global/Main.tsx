import { useContext } from "react";

import { CartStateContext } from "~/components/global/CartStateWrapper";

export default function Main({ children }) {
  const { isOpen, closeDrawer } = useContext(CartStateContext);

  return (
    <div className={isOpen && "--cart-is-open"} onClick={closeDrawer}>
      <main role="main">{children}</main>
    </div>
  );
}
