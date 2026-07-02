
import { useState, useEffect, useContext } from "react"
import { Context } from "./usecontext"

export const VendorDashboard = () => {

    const [d,setd]=useState([])
    const {id}=useContext(Context)

    useEffect(()=>{
        show()
    },[id])

    const show=async()=>{
        const result=await fetch(`https://elcto-1.onrender.com/api/vendorproduct/${id}`,{
            method:"get"
        })
        if(result.ok){
            const res=await result.json()
            if(res.statuscode===1){
                setd(res.data)
            }
        }
    }

    return(
        <>
        <h1>Vendor Dashboard</h1>
        <p>Welcome to your dashboard, where you can manage your products and view sales data.</p>
       
            <div className="container my-5">
                <div className="row">
                  
                        {
                            d.map((a)=>(
                                  <div className="col-lg-4 d-flex col-md-6 col-6">
                                 <div className="card w-100 border-0 shadow-sm text-center p-3">
                            <div className=" rounded d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                <img
                                    src={`/uploads/${a.Img}`}
                                    alt={a.name}
                                    className="img-fluid"
                                    style={{ maxHeight: "120px" }}
                                />
                            </div>

                            <div className="card-body p-0">
                                <h6 className="fw-semibold mb-2">{a.ProductName}</h6>
                                <p className="mb-2 text-muted">Price: {a.ProductPrice}</p>
                                <p className="mb-2 text-muted">Sale: {a.SalePrice}%</p>
                            </div>
                        </div>  
                        </div>
                            ))
                        }
                               
               

            </div>
            </div>
     
        </>
    )
}