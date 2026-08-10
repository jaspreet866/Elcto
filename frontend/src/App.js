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
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("theme", theme);
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
