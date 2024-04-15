import { createContext } from "react";

import { useNavigation } from "./MobileNavigation";

export const NavigationStateContext = createContext({});

/**
 * A component that wraps cart state logic around a child component
 */
export default function NavigationStateProvider({ children }) {
  const { navIsOpen, openNav, closeNav } = useNavigation();

  return (
    <NavigationStateContext.Provider value={{ navIsOpen, openNav, closeNav }}>
      {children}
    </NavigationStateContext.Provider>
  );
}
