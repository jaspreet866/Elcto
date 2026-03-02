import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSearchParams } from "react-router-dom"

export const Brand = () => {

  const [d, setd] = useState([])
  const [idd, setidd] = useState("")
  const [pr] = useSearchParams()
  const prr = pr.get("id")

  useEffect(() => {
    show()
  }, [])

  const show = async () => {
    const result = await fetch(`https://elcto-1.onrender.com/api/brand/${prr}`, {
      method: "get"
    })
    if (result.ok) {
      const res = await result.json()
      if (res.statuscode === 1) {
        setd(res.data)
        setidd(res.data[0]?.Category)
      }
      else {
        alert("no")
      }
    }

  }


  return (
    <>
      <div className="container mt-5">
        <div className="row g-4">
          {
            d.map((a) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={a._id}>
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
<div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>
                    <div className="mb-3 gap-3 d-flex justify-content-center"> 
                      <p className="text-danger fw-semibold fs-5">
                       ₹{a.SalePrice}
                      </p>
                       <p className=" h4 fw-bold text-success me-2">
                        ₹{a.ProductPrice}
                      </p>
                    </div>

                    <Link to={`/detail?id=${a._id}&cid=${idd} `} className="btn btn-primary btn-sm w-50">
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

    </>
  )
}