import { useContext, useEffect, useRef, useState } from "react"
import { Context } from "./usecontext"
import Swal from "sweetalert2"
import { Link, useNavigate } from "react-router-dom"
import { API_BASE } from "./apiConfig"
import { SEO } from "./SEO"
import { inr } from "./format"
import "./Shop.css"

export const Cart = () => {
    const [d, setd] = useState([])
    const [price, setprice] = useState(0)
    const [loading, setloading] = useState(true)
    const latestLoad = useRef(0)
    const { id, fetchCart } = useContext(Context)
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
        const load = ++latestLoad.current
        try {
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
        } finally {
            // The user id arrives just after mount; only the newest request ends the loading state.
            if (load === latestLoad.current) setloading(false)
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
            if (fetchCart) fetchCart();
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
                if (fetchCart) fetchCart();

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





    const itemCount = d.reduce((acc, item) => acc + (Number(item.Quantity) || 0), 0)

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
                                <Link to="/" className="h6 link text-decoration-none">
                                    Home
                                </Link>
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
            <section className="shop-page">
                <div className="container">
                    {loading ? (
                        <div className="shop-layout" aria-busy="true">
                            <div className="shop-panel">
                                <div className="shop-skeleton shop-skeleton-row"></div>
                                <div className="shop-skeleton shop-skeleton-row"></div>
                                <div className="shop-skeleton shop-skeleton-row"></div>
                            </div>
                            <div className="shop-panel">
                                <div className="shop-skeleton shop-skeleton-block"></div>
                            </div>
                        </div>
                    ) : d.length === 0 ? (
                        <div className="shop-panel shop-empty">
                            <div className="shop-empty-icon">
                                <i className="bi bi-bag"></i>
                            </div>
                            <h2 className="shop-empty-title">Your cart is empty</h2>
                            <div className="shop-empty-text">Browse the store and add the products you like. They will show up here.</div>
                            <Link to="/product" className="btn btn-primary shop-btn">
                                <i className="bi bi-grid"></i> Browse products
                            </Link>
                        </div>
                    ) : (
                        <div className="shop-layout">
                            <div className="shop-panel">
                                <div className="shop-panel-head">
                                    <h2 className="shop-panel-title">Items in your cart</h2>
                                    <small className="shop-panel-meta">{itemCount} {itemCount === 1 ? "item" : "items"}</small>
                                </div>
                                <ul className="cart-items">
                                    {
                                        d.map((a, index) =>
                                            <li className="cart-item" key={index}>
                                                <img className="shop-thumb" src={`${a.Img}`} alt={a.Name} />
                                                <div className="cart-item-info">
                                                    <div className="cart-item-name">{a.Name}</div>
                                                    <small className="cart-item-unit">{inr(a.Price)} each</small>
                                                </div>
                                                <div className="qty-stepper" role="group" aria-label={`Quantity of ${a.Name}`}>
                                                    <button type="button" aria-label="Decrease quantity" disabled={a.Quantity <= 1} onClick={() => qty(index, -1)}>
                                                        <i className="bi bi-dash"></i>
                                                    </button>
                                                    <output>{a.Quantity}</output>
                                                    <button type="button" aria-label="Increase quantity" onClick={() => qty(index, 1)}>
                                                        <i className="bi bi-plus"></i>
                                                    </button>
                                                </div>
                                                <strong className="cart-item-total">{inr(a.Price * a.Quantity)}</strong>
                                                <button type="button" className="cart-item-remove" aria-label={`Remove ${a.Name}`} onClick={() => remove(a._id)}>
                                                    <i className="bi bi-trash3"></i>
                                                </button>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                            <aside className="shop-panel shop-summary">
                                <div className="shop-panel-head">
                                    <h2 className="shop-panel-title">Order Summary</h2>
                                </div>
                                <div className="shop-panel-body">
                                    <dl className="shop-summary-rows">
                                        <div className="shop-summary-row">
                                            <dt>Subtotal</dt>
                                            <dd>{inr(price)}</dd>
                                        </div>
                                        <div className="shop-summary-row">
                                            <dt>Discount</dt>
                                            <dd>{inr(0)}</dd>
                                        </div>
                                        <div className="shop-summary-row shop-summary-total">
                                            <dt>Total</dt>
                                            <dd>{inr(price)}</dd>
                                        </div>
                                    </dl>
                                    <div className="shop-summary-actions">
                                        <button
                                            className="btn btn-primary shop-btn shop-btn-block"
                                            onClick={async () => {
                                                navigate(`/checkout?id=${id}`, { state: { totalprice: price } });

                                            }}
                                        >
                                            Checkout <i className="bi bi-arrow-right"></i>
                                        </button>

                                        <button className="btn shop-btn shop-btn-ghost shop-btn-block" onClick={() => navigate("/")}>Continue shopping</button>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
