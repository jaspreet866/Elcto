import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';
import { Footer } from './footer';
import { Context } from './usecontext';
import { Header } from './header';
import { Rout } from './routes';
import { AdminHeader } from './adminheader';
import ScrollToTop from './scroll'; 
import CustomCursor from './CustomCursor'; 
import MiniCartDrawer from './MiniCartDrawer';
import { Chatbot } from './Chatbot';
import { API_BASE } from './apiConfig';
import Swal from 'sweetalert2';


function App() {
  const location = useLocation();
  const [id, setid] = useState("")
  const [utype, setutype] = useState("")
  const [mail, setmail] = useState("")
  
  // Cart Global State
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };
  const [theme, setTheme] = useState(getPreferredTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("theme", theme);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute("content", theme === "dark" ? "#090d16" : "#f8fafc");
  }, [theme]);

  // Listen to OS-level theme changes if no manual preference is locked in session
  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mediaQuery) return;
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener?.("change", handleChange);
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, []);

  const decodeToken = (stored) => {
    if (!stored) return null;
    let info = stored;
    try {
      info = typeof stored === 'string' && (stored.startsWith('"') || stored.startsWith('{')) ? JSON.parse(stored) : stored;
    } catch (e) {
      info = stored;
    }
    if (typeof info === "string") {
      const parts = info.split(".");
      if (parts.length === 3) {
        try {
          const payload = parts[1];
          const enc = payload.replace(/-/g, '+').replace(/_/g, '/');
          const str = atob(enc);
          return JSON.parse(str);
        } catch (e) {
          console.warn("Auth token decode error:", e);
        }
      }
    }
    return null;
  };

  const loginAuth = useCallback((token) => {
    if (!token) return;
    try {
      localStorage.setItem("data", JSON.stringify(token));
      const decode = decodeToken(token);
      if (decode) {
        if (decode.usertype) setutype(decode.usertype);
        if (decode.id) setid(decode.id);
        if (decode.mail || decode.email) setmail(decode.mail || decode.email);
      }
    } catch (err) {
      console.warn("Login auth error:", err);
    }
  }, []);

  const logoutAuth = useCallback(() => {
    localStorage.removeItem("data");
    localStorage.removeItem("user_details");
    setid("");
    setutype("");
    setmail("");
    setCartItems([]);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("data");
    if (stored) {
      const decode = decodeToken(stored);
      if (decode) {
        if (decode.usertype) setutype(decode.usertype);
        if (decode.id) setid(decode.id);
        if (decode.mail || decode.email) setmail(decode.mail || decode.email);
      }
    }
  }, []);

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (!id) {
      setCartItems([]);
      return;
    }
    try {
      const result = await fetch(`${API_BASE}/api/getcartdata/${id}`);
      if (result.ok) {
        const res = await result.json();
        if (res.statuscode === 1 && Array.isArray(res.data)) {
          setCartItems(res.data);
        } else {
          setCartItems([]);
        }
      }
    } catch (err) {
      console.error("Error fetching cart data:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchCart();
  }, [id, fetchCart]);

  // Derived totals
  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.Quantity) || 1), 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.Quantity) || 1) * (Number(item.Price) || 0), 0);
  }, [cartItems]);

  // Update quantity in mini-cart
  const updateCartQty = async (index, change) => {
    const item = cartItems[index];
    if (!item) return;
    const newQty = item.Quantity + change;
    if (newQty < 1) return;

    try {
      const result = await fetch(`${API_BASE}/api/cartquantity/${item._id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity: newQty }),
        headers: { "Content-type": "application/json;charset=UTF-8" }
      });
      const res = await result.json();
      if (result.ok && res.statuscode === 1) {
        setCartItems(prev =>
          prev.map((ci, i) => (i === index ? { ...ci, Quantity: newQty } : ci))
        );
      } else {
        Swal.fire({
          icon: "info",
          title: "Stock Limit",
          text: res.message || "Requested quantity is not available."
        });
      }
    } catch (err) {
      console.error("Failed to update cart quantity", err);
    }
  };

  // Remove single item from mini-cart
  const removeCartItem = async (cartId) => {
    try {
      const result = await fetch(`${API_BASE}/api/remove/${cartId}`, {
        method: "DELETE"
      });
      const res = await result.json();
      if (res.statuscode === 1) {
        setCartItems(prev => prev.filter(item => item._id !== cartId));
      }
    } catch (err) {
      console.error("Failed to remove cart item", err);
    }
  };

  // Global Add to Cart helper with instant drawer feedback
  const addToCartGlobal = async (productId, quantity = 1) => {
    if (!id) {
      Swal.fire({
        icon: "info",
        title: "Please Sign In",
        text: "You need to log in to add items to your cart."
      });
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/api/cartdata/${productId}`, {
        method: "POST",
        body: JSON.stringify({ id, value: quantity }),
        headers: { "Content-type": "application/json;charset=UTF-8" }
      });
      const data = await response.json();

      if (data.statuscode === 1) {
        await fetchCart();
        setIsCartOpen(true); // Open luxury drawer immediately
        return true;
      } else if (data.statuscode === 2) {
        setIsCartOpen(true);
        return true;
      } else {
        Swal.fire({
          icon: "warning",
          title: "Unavailable",
          text: data.message || "Failed to add product to cart."
        });
        return false;
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      return false;
    }
  };

  return (
    <div className="App">
      <Context.Provider
        value={{
          id,
          setid,
          utype,
          setutype,
          mail,
          setmail,
          theme,
          toggleTheme,
          isCartOpen,
          setIsCartOpen,
          cartItems,
          setCartItems,
          cartCount,
          cartTotal,
          fetchCart,
          updateCartQty,
          removeCartItem,
          addToCartGlobal,
          loginAuth,
          logoutAuth
        }}
      >
        <CustomCursor />
        {utype === "admin" || utype === "Vendor" ? <AdminHeader /> : <Header />}
        <MiniCartDrawer />
        <Chatbot />
        <ScrollToTop />
        <Rout />
        <Footer />
        <SpeedInsights route={location.pathname} />
      </Context.Provider>
    </div>
  );
}

export default App;

