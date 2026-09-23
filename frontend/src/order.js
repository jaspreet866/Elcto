import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Context } from "./usecontext"
import { SEO } from "./SEO"
import { API_BASE } from "./apiConfig"

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
                return <span className="badge bg-success px-3 py-2 rounded-pill"><i className="bi bi-check-circle-fill me-1"></i> Delivered</span>
            case "Shipped":
            case "Out for Delivery":
                return <span className="badge bg-info text-dark px-3 py-2 rounded-pill"><i className="bi bi-truck me-1"></i> {s}</span>
            case "Cancelled":
                return <span className="badge bg-danger px-3 py-2 rounded-pill"><i className="bi bi-x-circle-fill me-1"></i> Cancelled</span>
            case "Confirmed":
                return <span className="badge bg-primary px-3 py-2 rounded-pill"><i className="bi bi-patch-check-fill me-1"></i> Confirmed</span>
            default:
                return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill"><i className="bi bi-clock-history me-1"></i> Processing</span>
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

            <div className="container my-5">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                            <span className="visually-hidden">Loading orders...</span>
                        </div>
                        <p className="mt-3 text-muted">Retrieving your order history...</p>
                    </div>
                ) : !id ? (
                    <div className="text-center py-5">
                        <i className="bi bi-person-lock fs-1 text-muted"></i>
                        <h4 className="mt-3">Please Log In</h4>
                        <p className="text-muted">You need to be logged in to view your orders.</p>
                        <Link to="/login" className="btn btn-primary px-4 py-2 mt-2">Log In</Link>
                    </div>
                ) : d.length === 0 ? (
                    <div className="text-center py-5 card border-0 shadow-sm p-5 rounded-4">
                        <div className="mb-3">
                            <i className="bi bi-bag-x text-muted" style={{ fontSize: "3.5rem" }}></i>
                        </div>
                        <h4>No Orders Yet</h4>
                        <p className="text-muted">You haven't placed any orders with us yet. Discover the latest electronics now!</p>
                        <div>
                            <Link to="/product" className="btn btn-primary px-4 py-2 rounded-pill">
                                <i className="bi bi-cart me-2"></i> Explore Products
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {d.map((a, index) => {
                            const currentStatus = a.OrderStatus || "Processing"
                            const steps = ["Processing", "Confirmed", "Shipped", "Delivered"]
                            const currentStepIdx = currentStatus === "Cancelled" ? -1 : steps.indexOf(currentStatus)

                            return (
                                <div className="col-lg-6 col-12" key={a._id || index}>
                                    <div className="card rounded-4 shadow-sm border-0 overflow-hidden mb-3">
                                        <div className="card-header bg-white border-bottom p-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                                            <div>
                                                <span className="fw-bold text-dark me-2">Order #{a.OrderNo || a._id?.slice(-6)}</span>
                                                <small className="text-muted d-block">{formatDate(a.Date || a.createdAt)}</small>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                {getStatusBadge(a.OrderStatus)}
                                                <span className="badge bg-light text-dark border px-2 py-1">
                                                    {a.Payment || "COD"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status progress bar */}
                                        {currentStatus !== "Cancelled" && (
                                            <div className="px-4 pt-3 pb-1 bg-light">
                                                <div className="d-flex justify-content-between text-center position-relative mb-2">
                                                    {steps.map((st, sIdx) => {
                                                        const isDone = sIdx <= (currentStepIdx === -1 ? 0 : currentStepIdx)
                                                        return (
                                                            <div key={st} className="flex-fill position-relative">
                                                                <div 
                                                                    className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${isDone ? 'bg-primary text-white' : 'bg-white border text-muted'}`}
                                                                    style={{ width: "24px", height: "24px", fontSize: "11px", fontWeight: "bold" }}
                                                                >
                                                                    {isDone ? "✓" : sIdx + 1}
                                                                </div>
                                                                <small style={{ fontSize: "11px" }} className={`d-block mt-1 ${isDone ? 'fw-bold text-primary' : 'text-muted'}`}>
                                                                    {st}
                                                                </small>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <div className="card-body p-3">
                                            {Array.isArray(a.Order) && a.Order.map((b, i) => (
                                                <div key={i} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img
                                                            src={b.Img || "/placeholder.png"}
                                                            alt={b.ProductName}
                                                            style={{
                                                                height: "60px",
                                                                width: "60px",
                                                                objectFit: "cover",
                                                                borderRadius: "8px"
                                                            }}
                                                            onError={(e) => { e.target.style.display = 'none' }}
                                                        />
                                                        <div>
                                                            <div className="fw-semibold product-title" style={{ fontSize: "0.95rem" }}>
                                                                {b.ProductName}
                                                            </div>
                                                            <small className="text-muted">
                                                                Qty: {b.Quantity || 1} × ₹{b.Price}
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div className="fw-bold text-dark">
                                                        ₹{(Number(b.Price) || 0) * (Number(b.Quantity) || 1)}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="d-flex justify-content-between align-items-center pt-3">
                                                <span className="text-muted">Total Paid</span>
                                                <span className="fs-5 fw-bold text-primary">₹{a.Total}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}