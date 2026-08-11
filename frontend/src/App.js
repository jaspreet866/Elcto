import { useEffect, useState } from 'react';
import './App.css';
import { Footer } from './footer';
import { Context } from './usecontext';
import { Header } from './header';
import { Rout } from './routes';
import { AdminHeader } from './adminheader';
import ScrollToTop from './scroll'; 
import CustomCursor from './CustomCursor'; 


function App() {
  const [id, setid] = useState("")
  const [utype, setutype] = useState("")
  const [mail, setmail] = useState("")
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };
  const [theme, setTheme] = useState(getPreferredTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("theme", theme);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute("content", theme === "dark" ? "#090d16" : "#f8fafc");
  }, [theme]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("data");
      if (stored) {
        let info = stored;
        try {
          info = JSON.parse(stored);
        } catch (e) {
          info = stored;
        }
        if (typeof info === "string") {
          const parts = info.split(".");
          if (parts.length === 3) {
            const payload = parts[1];
            const enc = payload.replace(/-/g, '+').replace(/_/g, '/');
            const str = atob(enc);
            const decode = JSON.parse(str);
            if (decode) {
              if (decode.usertype) setutype(decode.usertype);
              if (decode.id) setid(decode.id);
              if (decode.mail) setmail(decode.mail);
            }
          }
        }
      }
    } catch (err) {
      console.warn("Auth token decode error:", err);
    }
  }, []);

  return (
    <div className="App">

      <Context.Provider value={{ id, setid, utype, setutype, mail, setmail, theme, toggleTheme }}>
        <CustomCursor />
        {
          utype === "admin" || utype==="Vendor" ? <AdminHeader></AdminHeader> : <Header></Header>

        }
        <ScrollToTop></ScrollToTop>
        <Rout></Rout>
        <Footer></Footer>
      </Context.Provider>

    </div>
  );
}

export default App;
