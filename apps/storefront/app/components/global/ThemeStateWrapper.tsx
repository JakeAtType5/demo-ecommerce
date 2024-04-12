import { createContext, useState } from "react";

export const ThemeStateContext = createContext({});

/**
 * A component that wraps theme state logic around a child component
 */
export default function ThemeStateProvider({ children }) {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeStateContext.Provider value={{ theme, setTheme }}>
      <div className={`${theme}-theme content-wrapper`}>{children}</div>
    </ThemeStateContext.Provider>
  );
}
