import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Context } from "./usecontext"
import { SEO } from "./SEO"
import { API_BASE } from "./apiConfig"
import { inr } from "./format"
import "./Shop.css"

export const Order = () => {
    const [d, setd] = useState([])
    const [loading, setLoading] = useState(true)
    const { id } = useContext(Context)

    useEffect(() => {
        if (id) {
            show()
        } else {
            setLoading(false)
        }
    }, [id])

    const show = async () => {
        setLoading(true)
        try {
            const result = await fetch(`${API_BASE}/api/myorder/${id}`, {
                method: "get"
            })
            if (result.ok) {
                const res = await result.json()
                if (res.statuscode === 1 && Array.isArray(res.data)) {
                    setd(res.data.reverse())
                } else {
                    setd([])
                }
            } else {
                setd([])
            }
        } catch (err) {
            console.error("Failed to fetch orders:", err)
            setd([])
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const s = status || "Processing"
        switch (s) {
            case "Delivered":
                return <div className="order-status order-status--delivered"><i className="bi bi-check-circle-fill"></i> Delivered</div>
            case "Shipped":
            case "Out for Delivery":
                return <div className="order-status order-status--shipped"><i className="bi bi-truck"></i> {s}</div>
            case "Cancelled":
                return <div className="order-status order-status--cancelled"><i className="bi bi-x-circle-fill"></i> Cancelled</div>
            case "Confirmed":
                return <div className="order-status order-status--confirmed"><i className="bi bi-patch-check-fill"></i> Confirmed</div>
            default:
                return <div className="order-status order-status--processing"><i className="bi bi-clock-history"></i> Processing</div>
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "Recent"
        try {
            const date = new Date(dateStr)
            if (isNaN(date.getTime())) return String(dateStr).split("T")[0]
            return date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            })
        } catch {
            return "Recent"
        }
    }

    return (
        <>
            <SEO
                title="My Orders"
                robots="noindex, nofollow"
            />
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

            <section className="shop-page">
                <div className="container">
                    {loading ? (
                        <div className="order-grid" aria-busy="true">
                            <div className="shop-panel">
                                <div className="shop-skeleton shop-skeleton-block"></div>
                            </div>
                            <div className="shop-panel">
                                <div className="shop-skeleton shop-skeleton-block"></div>
                            </div>
                            <div className="visually-hidden" role="status">Loading orders...</div>
                        </div>
                    ) : !id ? (
                        <div className="shop-panel shop-empty">
                            <div className="shop-empty-icon">
                                <i className="bi bi-person-lock"></i>
                            </div>
                            <h2 className="shop-empty-title">Please Log In</h2>
                            <div className="shop-empty-text">You need to be logged in to view your orders.</div>
                            <Link to="/login" className="btn btn-primary shop-btn">Log In</Link>
                        </div>
                    ) : d.length === 0 ? (
                        <div className="shop-panel shop-empty">
                            <div className="shop-empty-icon">
                                <i className="bi bi-bag-x"></i>
                            </div>
                            <h2 className="shop-empty-title">No Orders Yet</h2>
                            <div className="shop-empty-text">You haven't placed any orders with us yet. Discover the latest electronics now!</div>
                            <Link to="/product" className="btn btn-primary shop-btn">
                                <i className="bi bi-cart"></i> Explore Products
                            </Link>
                        </div>
                    ) : (
                        <div className="order-grid">
                            {d.map((a, index) => {
                                const currentStatus = a.OrderStatus || "Processing"
                                const steps = ["Processing", "Confirmed", "Shipped", "Delivered"]
                                const currentStepIdx = currentStatus === "Cancelled" ? -1 : steps.indexOf(currentStatus)
                                const activeStepIdx = currentStepIdx === -1 ? 0 : currentStepIdx

                                return (
                                    <article className="shop-panel order-card" key={a._id || index}>
                                        <div className="order-card-head">
                                            <div>
                                                <div className="order-number">Order #{a.OrderNo || a._id?.slice(-6)}</div>
                                                <small className="order-date">{formatDate(a.Date || a.createdAt)}</small>
                                            </div>
                                            <div className="order-tags">
                                                {getStatusBadge(a.OrderStatus)}
                                                <div className="order-pay">
                                                    {a.Payment || "COD"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status progress bar */}
                                        {currentStatus !== "Cancelled" && (
                                            <ol className="order-track">
                                                {steps.map((st, sIdx) => {
                                                    const isDone = sIdx <= activeStepIdx
                                                    return (
                                                        <li
                                                            key={st}
                                                            className={`${isDone ? "is-done" : ""} ${sIdx === activeStepIdx ? "is-current" : ""}`}
                                                            aria-current={sIdx === activeStepIdx ? "step" : undefined}
                                                        >
                                                            <div className="order-track-dot">
                                                                {isDone ? <i className="bi bi-check-lg"></i> : sIdx + 1}
                                                            </div>
                                                            {st}
                                                        </li>
                                                    )
                                                })}
                                            </ol>
                                        )}

                                        <ul className="shop-lines">
                                            {Array.isArray(a.Order) && a.Order.map((b, i) => (
                                                <li key={i} className="shop-line">
                                                    <img
                                                        src={b.Img || "/placeholder.png"}
                                                        alt={b.ProductName}
                                                        className="shop-thumb"
                                                        onError={(e) => { e.target.style.visibility = 'hidden' }}
                                                    />
                                                    <div>
                                                        <div className="shop-line-name">{b.ProductName}</div>
                                                        <small className="shop-line-meta">
                                                            Qty: {b.Quantity || 1} × {inr(b.Price)}
                                                        </small>
                                                    </div>
                                                    <div className="shop-line-price">
                                                        {inr((Number(b.Price) || 0) * (Number(b.Quantity) || 1))}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="order-card-foot">
                                            <div>Total Paid</div>
                                            <strong>{inr(a.Total)}</strong>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
