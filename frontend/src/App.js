import { useEffect, useState } from 'react';
import './App.css';
import { Footer } from './footer';
import { Context } from './usecontext';
import { Header } from './header';
import { Rout } from './routes';
import { AdminHeader } from './adminheader';
import ScrollToTop from './scroll'; 


function App() {
  const [id, setid] = useState("")
  const [utype, setutype] = useState("")
  const [mail, setmail] = useState("")


  useEffect(() => {
    const token = localStorage.getItem("data")

    if (!token) {
      setutype("")
      setid("")
      setmail("")
      return
    }

    try {
      const parts = JSON.parse(token).split(".")
      if (parts.length !== 3) return

      const payload = parts[1]
      const enc = payload.replace(/-/g, '+').replace(/_/g, '/')
      const str = atob(enc)
      const decode = JSON.parse(str)

      setutype(decode.usertype || "")
      setid(decode.id || "")
      setmail(decode.mail || "")
    } catch (error) {
      localStorage.removeItem("data")
      setutype("")
      setid("")
      setmail("")
    }
  }, [])

  return (
    <div className="App">

      <Context.Provider value={{ id, setid, utype, setutype, mail, setmail }}>
        {
          utype === "admin" ? <AdminHeader></AdminHeader> : <Header></Header>

        }
        <ScrollToTop></ScrollToTop>
        <Rout></Rout>
        <Footer></Footer>
      </Context.Provider>

    </div>
  );
}

export default App;
