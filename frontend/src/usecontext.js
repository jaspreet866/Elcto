import { createContext, useContext } from "react";

export const Context = createContext({
    id: "",
    setid: () => {},
    utype: "",
    setutype: () => {},
    mail: "",
    setmail: () => {},
    theme: "light",
    toggleTheme: () => {},
    isCartOpen: false,
    setIsCartOpen: () => {},
    cartItems: [],
    setCartItems: () => {},
    cartCount: 0,
    cartTotal: 0,
    fetchCart: () => {},
    updateCartQty: () => {},
    removeCartItem: () => {},
    addToCartGlobal: () => {},
    loginAuth: () => {},
    logoutAuth: () => {}
});

export const useApp = () => useContext(Context);