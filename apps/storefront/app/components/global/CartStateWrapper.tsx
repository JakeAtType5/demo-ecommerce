import { createContext } from "react";

import { useDrawer } from "~/components/cart/CartDrawer";

export const CartStateContext = createContext({});

/**
 * A component that wraps cart state logic around a child component
 */
export default function CartStateProvider({ children }) {
  const { cartIsOpen, openDrawer, closeDrawer } = useDrawer();

  return (
    <CartStateContext.Provider value={{ cartIsOpen, openDrawer, closeDrawer }}>
      {children}
    </CartStateContext.Provider>
  );
}
