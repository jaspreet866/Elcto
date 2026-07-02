import API_URL from "./config"
import { useState } from "react"

export const Vendor = () => {

    const [name,setname]=useState("")
    const[uname,setuname]=useState("")
    const[email,setemail]=useState("")
    const[pass,setpass]=useState("")
    const[bank,setbank]=useState("")
    const[phn,setphn]=useState()
    const[city,setcity]=useState("")
    const [state,setstate]=useState("")

const register=async(e)=>{
    e.preventDefault();
    const data={name,uname,email,phn,pass,bank,city,state}
    const result = await fetch(`${API_URL}/api/vendorregister`,{
        method:"post",
        body:JSON.stringify(data),
        headers:{"Content-type":"application/json;charset=UTF-8"}
    })
    if(result.ok){
        const res=await result.json()
        if(res.statuscode===1){
            alert("okk")
        }
        else{
           alert("fdfe")
        }
    }
}

    return (
        <>
            <h1 className="mt-5">Vendor</h1>
            <p className="lead">Apply to become a vendor and start selling your products.</p>
            <form onSubmit={register}>
               <div className="container">
               <div className="row py-5">
                 <div className="col col-lg-6">
                    <div className="d-flex gap-3 justify-content-between">
                 <div className="mb-3 w-100">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control rounded-pill" id="name" onChange={(e) => setname(e.target.value)} />
                </div>
                  <div className="mb-3 w-100">
                    <label htmlFor="email" className="form-label">Username</label>
                    <input type="text" className="form-control rounded-pill " id="uname" onChange={(e) => setuname(e.target.value)} />
                </div>
               </div>
                    <div className="d-flex gap-3 justify-content-between">
                <div className="mb-3 w-100">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control rounded-pill"  id="email" onChange={(e) => setemail(e.target.value)} />
                </div>
               </div>
                    <div className="d-flex gap-3 justify-content-between">
                <div className="mb-3 w-100">
                    <label  className="form-label">Password</label>
                    <input type="password" className="form-control rounded-pill" id="password" onChange={(e) => setpass(e.target.value)} />
                </div>
               </div>
               <div className="d-flex gap-3 mb-3 ">
                <div className="w-100">
                    <label className="form-label" >Bank Name</label>
                    <input type="text" className="form-control rounded-pill" onChange={(e) => setbank(e.target.value)}></input>
                </div>
                <div className="w-100">
                    <label className="form-label" >Phone</label>
                    <input type="number" className="form-control rounded-pill" onChange={(e) => setphn(e.target.value)}></input>
                </div>
               </div>
               <div className="d-flex gap-3 mb-3 ">
                <div className="w-100">
                    <label className="form-label" >City</label>
                    <input type="text" className="form-control rounded-pill" onChange={(e) => setcity(e.target.value)}></input>
                </div>
                <div className="w-100">
                    <label className="form-label" >State</label>
                    <input type="text" className="form-control rounded-pill" onChange={(e) => setstate(e.target.value)}></input>
                </div>
               </div>
                <button type="submit" className="btn btn-primary w-25">Apply</button>
                </div>
              <div className="col d-flex flex-column justify-content-center align-items-center text-center">
    <img 
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
        alt="vendor" 
        style={{ width: "150px" }}
        className="mb-3"
    />

    <h4 className="fw-bold">Grow Your Business</h4>
    <p className="text-muted">
        Join our platform and start selling your products to a wide audience.
    </p>

    <ul className="list-unstyled mt-3">
        <li>✔ Easy onboarding</li>
        <li>✔ Secure payments</li>
        <li>✔ High reach</li>
    </ul>
    <p>Already A Vendor? <a href="/vlogin">Vendor Login</a></p>
</div>
               </div>
               </div>
            </form>
           
        </>
    )
}