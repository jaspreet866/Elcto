import { useContext, useEffect, useState } from "react"
import { Context } from "./usecontext"
import { useNavigate } from "react-router-dom"
export const Admin = () => {

    const [d, setd] = useState([])
    const [ad, setadmins] = useState("")
    const [status, setstatus] = useState("")
    const navigate=useNavigate()
    const{utype}=useContext(Context)
    



    useEffect(() => {
        show()
    }, [])

    const show = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/users", {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setd(res.data)
            }
            else {
                alert("sfdfg")
            }
        }
    }
    const admin = async (id) => {

        const data = { ad }
        const result = await fetch(`https://elcto-1.onrender.com/api/makeadmin/${id}`, {
            method: "put",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                alert("type changed ")
                show()
            }
            else {
                alert("not changed")
            }
        }
    }
    const changeStatus = async (id) => {
        const data = { status }
        const result = await fetch(`https://elcto-1.onrender.com/api/changestatus/${id}`, {
            method: "put",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                alert("status changed ")
                show()
            }
            else {
                alert("not changed")
            }
        }
    }

    return (
      <>
      {
        utype ==="admin" ?   <>
            <div className="container">
                <div className="row">
                   <h3 className="mt-5">User Data/Updation </h3>
                    <div className="col">
                        <section>
                            <div className="container ">
                                <div className="d-flex flex-wrap gap-3 mt-5 justify-content-center align-items-center text-center " >

                                    {
                                        d.map((a) =>
                                            <div id="users" className="card py-2 " style={{ width: "250px" }}>    
                                                <div className="">
                                                    <div>Name:{a.FirstName}</div>
                                                    <div>E-Mail:{a.Email}</div>
                                                    <p className="h4 ">UserType:{a.UserType}</p>
                                                  {a.Status === "Active" ? <span className="badge bg-success">{a.Status}</span> : <span className="badge bg-danger">Inactive</span>}
                                                </div>
                                                <div className="d-flex gap-3 justify-content-center align-items-center">
                                                <div className=""><select className="form-select m-auto" onChange={(e) => setadmins(e.target.value)}>
                                                    <option >Select</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="user">User</option>
                                                </select>
                                                    <button class="btn btn-primary mt-4 mb-4 " onClick={() => admin(a._id)}>Change </button></div>
                                                    <div>
                                                        <select className="form-select m-auto " onChange={(e) => setstatus(e.target.value)}>
                                                            <option >Select</option>
                                                            <option value="Active">Active</option>
                                                            <option value="Inactive">Inactive</option>
                                                        </select>
                                                        <button class="btn btn-primary mt-4 mb-4 " onClick={() => changeStatus(a._id)}>Change </button>
                                                    </div>
                                                    </div>
                                                </div>
                                        )
                                    }
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>:navigate("/")
      }
      </>
    )
}