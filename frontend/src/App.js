import { useEffect, useState } from 'react';
import './App.css';
import { Footer } from './footer';
import { Context } from './usecontext';
import { Header } from './header';
import { Rout } from './routes';
import { AdminHeader } from './adminheader';


function App() {
  const [id, setid] = useState("")
  const [utype, setutype] = useState("")
  const [mail, setmail] = useState("")


  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("data"))
    if (info) {
      const parts = info.split(".")
      if (parts.length === 3) {
        const payload = parts[1]
        const enc = payload.replace(/-/g, '+').replace(/_/g, '/')
        const str = atob(enc)
        const decode = JSON.parse(str)
        setutype(decode.usertype)
        setid(decode.id)
        setmail(decode.mail)
        console.log("mail is", mail)
      }
    }
  })

  return (
    <div className="App">

      <Context.Provider value={{ id, setid, utype, setutype, mail, setmail }}>
        {
          utype === "admin" ? <AdminHeader></AdminHeader> : <Header></Header>

        }
        <Rout></Rout>
        <Footer></Footer>
      </Context.Provider>

    </div>
  );
}

export default App;
