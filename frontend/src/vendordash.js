import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { Context } from "./usecontext"

export const VendorDashboard = () => {
    const [d, setd] = useState([])
    const [loading, setLoading] = useState(true)
    const { id } = useContext(Context)

    useEffect(() => { show() }, [id])

    const show = async () => {
        if (!id) { setLoading(false); return }
        setLoading(true)
        try {
            const result = await fetch(`https://elcto-1.onrender.com/api/vendorproduct/${id}`, { method: "get" })
            if (result.ok) {
                const res = await result.json()
                if (res.statuscode === 1) setd(res.data)
            }
        } finally { setLoading(false) }
    }

    return (
        <main className="vendor-dashboard">
            <div className="vendor-shell">
                <section className="vendor-dashboard-head">
                    <div><span className="vendor-eyebrow vendor-eyebrow-dark">Seller workspace</span><h1>Product overview</h1><p>Keep an eye on every product in your Elcto catalog.</p></div>
                    <Link to="/" className="vendor-outline-btn">View storefront <i className="bi bi-box-arrow-up-right"></i></Link>
                </section>
                <section className="vendor-dashboard-summary">
                    <div className="vendor-summary-card"><span className="vendor-summary-icon blue"><i className="bi bi-box-seam"></i></span><div><small>Total products</small><strong>{d.length}</strong></div></div>
                    <div className="vendor-summary-card"><span className="vendor-summary-icon mint"><i className="bi bi-tags"></i></span><div><small>Offers active</small><strong>{d.filter((item) => Number(item.SalePrice) > 0).length}</strong></div></div>
                    <div className="vendor-summary-card"><span className="vendor-summary-icon amber"><i className="bi bi-lightning-charge"></i></span><div><small>Catalog status</small><strong>Live</strong></div></div>
                </section>
                <section className="vendor-catalog-panel">
                    <div className="vendor-catalog-top"><div><h2>Your products</h2><p>{loading ? "Loading your catalog…" : `${d.length} product${d.length === 1 ? "" : "s"} in your catalog`}</p></div><button className="vendor-refresh-btn" onClick={show} aria-label="Refresh catalog"><i className="bi bi-arrow-clockwise"></i></button></div>
                    {loading ? <div className="vendor-empty-state"><div className="spinner-border" role="status"><span className="visually-hidden">Loading</span></div><p>Loading your product catalog…</p></div> : d.length === 0 ? <div className="vendor-empty-state"><span className="vendor-empty-icon"><i className="bi bi-box2"></i></span><h3>Your catalog is ready for its first product.</h3><p>Products associated with your seller account will appear here.</p></div> : <div className="vendor-product-grid">{d.map((a) => <article className="vendor-product-card" key={a._id}><div className="vendor-product-image"><img src={`/uploads/${a.Img}`} alt={a.ProductName} /><span className={Number(a.SalePrice) > 0 ? "vendor-sale-pill" : "vendor-live-pill"}>{Number(a.SalePrice) > 0 ? `${a.SalePrice}% off` : "Live"}</span></div><div className="vendor-product-info"><h3>{a.ProductName}</h3><div><span>List price</span><strong>₹{a.ProductPrice}</strong></div></div></article>)}</div>}
                </section>
            </div>
        </main>
    )
}
