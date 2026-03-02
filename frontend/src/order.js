import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Context } from "./usecontext"

export const Order = () => {
    const [d, setd] = useState([])
    const { id } = useContext(Context)

    useEffect(() => {
        show()
    }, [id])

    const show = async () => {
        const result = await fetch(`https://elcto-1.onrender.com/api/myorder/${id}`, {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setd(res.data)
            }
            else {
                alert("fg")
            }
        }
    }

    return (
        <>
            <section className="s-page-title d-flex align-items-center justify-content-center text-center">
                <div className="container-fluid bread">
                    <div className="content">
                        <h1 className="title-page">Orders</h1>

                        <ul className="breadcrumbs-page list-unstyled d-flex justify-content-center align-items-center gap-2 py-3">
                            <li>
                                <Link to="/" className="h6 link text-decoration-none">
                                    Home
                                </Link>
                            </li>

                            <li>
                                <span>{">"}</span>
                            </li>

                            <li>
                                <h6 className="current-page fw-normal mb-0">
                                    My Orders
                                </h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <div className="container my-5">
                <div className="row g-4">

                    {d.map((a, index) => (
                        <div className="col-lg-6 col-12" key={index}>

                            <div className="accordion" id={`accordion${index}`}>

                                <div className="accordion-item rounded-3 shadow-sm border-0">
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button collapsed fw-semibold"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${index}`}
                                        >
                                            <div className="w-100 d-flex justify-content-between">
                                                <span>Order #{a.OrderNo}</span>
                                                <span className="text-primary fw-bold">₹{a.Total}</span>
                                                <span className="badge bg-success px-3 py-2 rounded-pill">
                                                    {a.Payment}
                                                </span>
                                            </div>
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse${index}`}
                                        className="accordion-collapse collapse"
                                    >
                                        <div className="accordion-body">

                                            {a.Order.map((b, i) => (
                                                <div key={i} className="d-flex align-items-center justify-content-between mb-3">

                                                    <div className="d-flex align-items-center gap-3">
                                                        <img
                                                            src={`/uploads/${b.Img}`}
                                                            alt={b.ProductName}
                                                            style={{
                                                                height: "70px",
                                                                width: "70px",
                                                                objectFit: "cover",
                                                                borderRadius: "10px"
                                                            }}
                                                        />
                                                        <div>
                                                            <div className="fw-semibold">{b.ProductName}</div>
                                                            <small className="text-muted">₹{b.Price}</small>
                                                        </div>
                                                    </div>

                                                    <div className="fw-bold">
                                                        ₹{b.Price}
                                                    </div>

                                                </div>
                                            ))}


                                            <div className="border-top pt-3 mt-2 d-flex justify-content-between">
                                                <strong>Total:</strong>
                                                <strong className="text-primary">₹{a.Total}</strong>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            </div>





        </>
    )
}