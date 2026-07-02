import API_URL from "./config"
import { useEffect, useState } from "react"

export const ResetPassword=()=>{

    const[pass,setpass]=useState()
    const[cpass,setcpass]=useState()
  const[mail,setmail]=useState()
  const[msg,setmsg]=useState()
 

    useEffect(()=>{
 setmail(localStorage.getItem("email"))
},[])

    const reset=async(e)=>{
        e.preventDefault()
        const result=await fetch(`${API_URL}/api/resetpassword/${mail}`,{
            method:"put",
            body:JSON.stringify({pass,cpass}),
            headers:{"Content-type":"application/json;charset=UTF-8"}
        })
        if(result){
            const res=await result.json()
            if(res.statuscode===1){
                alert(res.message || "updated")
                localStorage.removeItem("email")
            }
            else{
                alert(res.message)
            }
            setmsg(res.message)
        }
        
    }



    return(
        <>
        <div>
            <h2 className="fw-bold mb-4">Reset Password</h2>
            <form onSubmit={reset}>
                <input className="mt-2" type="password" placeholder="Enter your new password" onChange={(e)=>setpass(e.target.value)}></input><br></br>
                <input className="mt-2" type="password" placeholder="Confirm your new password" onChange={(e)=>setcpass(e.target.value)}></input><br></br>
                <p>{msg}</p>
                <button type="submit" className="btn btn-primary mt-2" >Reset Password</button>
            </form>
        </div>
        </>
    )
}
