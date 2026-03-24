import e from "cors"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export const VendorLogin = () => {

    const[email,setemail]=useState("")
    const[pass,setpass]=useState("")
    const navigate=useNavigate()

    const login=async(e)=>{
        e.preventDefault()
        const result=await fetch("https://elcto-1.onrender.com/api/vlog",{
            method:"post",
            body:JSON.stringify({email,pass}),
            headers:{"Content-type":"application/json;charset=UTF-8"}
        })
        if(result.ok){
            const res=await result.json()
            if(res.statuscode===1){
                localStorage.setItem("data",JSON.stringify(res.token))
                console.log(res.data)
                alert("okk")
                navigate("/")
                
            }
            else{
               alert("fdfe")
            }
        }
    }


    return(
        <>
        <h1 className="mt-5">Vendor Login</h1>
        <p className="lead">Welcome back! Please login to your account.</p>
        <form onSubmit={login}>
            <div className="container">
                <div className="row py-5">
                    <div className="col col-lg-6">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label" >Email</label>
                            <input type="email" className="form-control rounded-pill" id="email" onChange={(e)=>setemail(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control rounded-pill" id="password" onChange={(e)=>setpass(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn-primary w-25">Login</button>
                    </div>
                </div>
            </div>
        </form>
        </>
    )
}