
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const Verifyy=()=>{

    const [otp,setOtp]=useState("");
    const [email,setEmail]=useState("");
    const navigate=useNavigate()

    useEffect(()=>{
        const params = new URLSearchParams(window.location.search);
        const emailFromUrl = params.get("email");
        const savedEmail = emailFromUrl || localStorage.getItem("email") || "";
        setEmail(savedEmail);
        if (emailFromUrl) {
            localStorage.setItem("email", emailFromUrl);
        }
    },[])
 
   const verify=async(e)=>{
    e.preventDefault();
    const data={email,otp}
    const result=await fetch("https://elcto-1.onrender.com/api/verify-otp",{
        method:"post",
        body:JSON.stringify(data),
        headers:{"Content-type":"application/json;charset=UTF-8"}
    })
    if(result){
        const res=await result.json()
        if(res.statuscode===1){
          alert("OTP Verified Successfully")
            localStorage.setItem("resetToken", res.resetToken)
            navigate("/resetpassword")
        }
        else{
            alert(res.message)
        }
    }
   }
  
 
    return(
        <>
       <div className="p-5">
         <h1 className="p-3">Enter your OTP that we sent to your email</h1>
        <input type="number" className="form-control w-50" placeholder="Enter OTP" onChange={(e)=>setOtp(e.target.value)}/>
        <button className="btn btn-primary m-3" onClick={verify}>Verify</button>
      
       </div>
        </>
    )
}
