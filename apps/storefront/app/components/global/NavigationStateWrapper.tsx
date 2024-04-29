import { createContext, useEffect } from "react";

import { useNavigation } from "./Navigation";
import { useLocation } from "@remix-run/react";

export const NavigationStateContext = createContext({});

/**
 * A component that wraps cart state logic around a child component
 */
export default function NavigationStateProvider({ children }) {
  const { navIsOpen, openNav, closeNav } = useNavigation();

  const location = useLocation();

  useEffect(() => {
    closeNav();
  }, [location]);

  return (
    <NavigationStateContext.Provider value={{ navIsOpen, openNav, closeNav }}>
      {children}
    </NavigationStateContext.Provider>
  );
}
