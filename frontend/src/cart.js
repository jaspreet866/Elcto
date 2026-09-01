import { useContext, useEffect, useState } from "react"
import { Context } from "./usecontext"
import Swal from "sweetalert2"
import { useNavigate, useSearchParams } from "react-router-dom"
import { API_BASE } from "./apiConfig"
import { SEO } from "./SEO"

export const Cart = () => {
    const [d, setd] = useState([])
    const [price, setprice] = useState(0)
    const { id } = useContext(Context)
    const navigate = useNavigate()
    useEffect(() => {
        show()

    }, [id])

    useEffect(() => {
        const total = d.reduce(
            (acc, item) => acc + (item.Quantity) * (item.Price), 0
        )
        setprice(total)
    })

    const show = async () => {
        const result = await fetch(`${API_BASE}/api/getcartdata/${id}`, {
            method: "get"
        })
        if (result.ok) {
            console.log(result)
            const res = await result.json()
            if (res.statuscode === 1) {
                setd(res.data)
            }
        }
    }
    const qty = async (index, change) => {
        const item = d[index]
        const newQty = item.Quantity + change
        if (newQty < 1) return

        const result = await fetch(`${API_BASE}/api/cartquantity/${item._id}`, {
            method: "PUT",
            body: JSON.stringify({ quantity: newQty }),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        const res = await result.json()
        if (result.ok && res.statuscode === 1) {
            setd(current => current.map((cartItem, itemIndex) =>
                itemIndex === index ? { ...cartItem, Quantity: newQty } : cartItem
            ))
        } else {
            Swal.fire("Stock unavailable", res.message || "This quantity is not available.", "info")
        }

    }

    const remove = async (id) => {

        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (confirm.isConfirmed) {

            const result = await fetch(`${API_BASE}/api/remove/${id}`, {
                method: "DELETE"
            });

            const res = await result.json();

            if (res.statuscode === 1) {

                Swal.fire({
                    icon: "success",
                    title: "Product Removed"
                });

                show(); // reload products

            } else {
                Swal.fire("Error", "Something went wrong", "error");
            }
        }
        else {
            Swal.fire({
                icon: "info",
                title: "Cancelled",
                text: "Your product is safe 🙂"
            })
        }
    };





    return (
        <>
            <SEO
                title="Your Shopping Cart"
                robots="noindex, nofollow"
            />
            <section className="s-page-title d-flex align-items-center justify-content-center text-center">
                <div className="container-fluid bread">
                    <div className="content">
                        <h1 className="title-page">Cart</h1>

                        <ul className="breadcrumbs-page list-unstyled d-flex justify-content-center align-items-center gap-2 py-3">
                            <li>
                                <a href="/" className="h6 link text-decoration-none">
                                    Home
                                </a>
                            </li>

                            <li>
                                <span>{">"}</span>
                            </li>

                            <li>
                                <h6 className="current-page fw-normal mb-0">
                                    Cart
                                </h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section>

                <div className="container mt-5">
                    <div className="row">
                        <div className="col-lg-9 cart-phn table-responsive">
                            <table className="table align-middle table-outlined">
                                <thead className="table-dark">
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th>PRODUCT</th>
                                        <th>PRICE</th>
                                        <th>QUANTITY</th>
                                        <th>TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        d.map((a, index) =>
                                            <tr key={index}>
                                                <td><button className="btn" onClick={() => remove(a._id)}><i class="bi bi-trash3-fill"></i></button></td>
                                                <td><img style={{ height: "60px" }} src={`${a.Img}`}></img></td>
                                                <td className="product-title">{a.Name}</td>
                                                <td>{a.Price}</td>
                                                <td><div className="d-flex justify-content-center align-items-center gap-2">
                                                    <button className="btn btn-sm " onClick={() => qty(index, -1)}> − </button>
                                                    <span className="fw-semibold">{a.Quantity}</span>
                                                    <button className="btn btn-sm " onClick={() => qty(index, 1)} > +</button>
                                                </div></td>
                                                <td>{a.Price * a.Quantity}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="col">
                            <div className="card shadow-sm w-100 sticky-top">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">Order Summary</h5>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal</span>
                                        <strong>{price}</strong>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Discount</span>
                                        <strong>0</strong>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between fs-5 mb-3">
                                        <strong>Total</strong>
                                        <strong>{price}</strong>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <button
                                            className="btn btn-sm btn-primary w-50"
                                            onClick={async () => {
                                                navigate(`/checkout?id=${id}`, { state: { totalprice: price } });

                                            }}
                                        >
                                            Checkout
                                        </button>

                                        <button className="btn btn-sm btn-primary  w-50" onClick={() => navigate("/")}>Shopoing</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section >
        </>
    )
}
