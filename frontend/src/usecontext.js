import { createContext, useContext } from "react";

export const Context = createContext({ id: "", theme: "light", toggleTheme: () => {} })