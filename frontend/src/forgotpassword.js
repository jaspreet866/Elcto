import API_URL from "./config"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export const ForgetPass=()=>{

const [email,setemail]=useState("")
const navigate=useNavigate()

const sendlink=async(e)=>{
    e.preventDefault()
   
    const result=await fetch(`${API_URL}/api/forgot`,{
        method:"post",
        body:JSON.stringify({email}),
        headers:{"Content-type":"application/json;charset=UTF-8"}
    })
    if(result){
        const res=await result.json()
        if(res.statuscode===1){
            alert(res.message)
            localStorage.setItem("email",email)
            navigate("/verify")
            setemail("")
        }
        else{
            alert(res.message)
            console.log(res.err)
        }
    }   
}



    return(
        <>
       <div className="p-5">
         <h1 className="">Forget Password</h1>
        <form className="d-flex flex-column align-items-center"> 
            <input className="form-control w-50" type="email" placeholder="Enter your email" onChange={(e)=>setemail(e.target.value)} /><br></br>
            <button className="btn btn-primary" type="submit" onClick={sendlink}>Send Reset Link</button>
        </form>
       </div>
        </>
    )
}