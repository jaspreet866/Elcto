import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSearchParams } from "react-router-dom"
import { SEO } from "./SEO"
import { API_BASE } from "./apiConfig"
import { inr } from "./format"
import "./Related.css"
import "./Shop.css"

export const Brand = () => {

  const [d, setd] = useState([])
  const [idd, setidd] = useState("")
  const [loading, setloading] = useState(true)
  const [pr] = useSearchParams()
  const prr = pr.get("id")

  useEffect(() => {
    show()
  }, [])

  const show = async () => {
    try {
      const result = await fetch(`${API_BASE}/api/brand/${prr}`, {
        method: "get"
      })
      if (result.ok) {
        const res = await result.json()
        if (res.statuscode === 1 && Array.isArray(res.data)) {
          setd(res.data)
          setidd(res.data[0]?.Category)
        } else {
          setd([])
        }
      }
    } catch (err) {
      console.error("Failed to fetch brand products:", err)
      setd([])
    } finally {
      setloading(false)
    }
  }


  return (
    <>
      <SEO
        title="Top Electronics Brands - Shop Genuine Products"
        description="Discover top electronics brands with genuine warranty and best pricing on ElectoMart."
        keywords="electronics brands, genuine electronics, Apple, Samsung, Sony, HP, Dell, ElectoMart"
      />
      <section className="s-page-title d-flex align-items-center justify-content-center text-center">
        <div className="container-fluid bread">
          <div className="content">
            <h1 className="title-page">Shop by Brand</h1>

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
                  Brand
                </h6>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="shop-page">
        <div className="container">
          {loading ? (
            <div className="row g-3 g-md-4" aria-busy="true">
              {[0, 1, 2, 3].map((n) => (
                <div className="col-lg-3 col-md-4 col-6" key={n}>
                  <div className="shop-skeleton shop-skeleton-card"></div>
                </div>
              ))}
            </div>
          ) : d.length === 0 ? (
            <div className="shop-panel shop-empty">
              <div className="shop-empty-icon">
                <i className="bi bi-box-seam"></i>
              </div>
              <h2 className="shop-empty-title">No products found</h2>
              <div className="shop-empty-text">There are no products listed for this brand right now.</div>
              <Link to="/" className="btn btn-primary shop-btn">Back to Home</Link>
            </div>
          ) : (
            <div className="row g-3 g-md-4">
              {
                d.map((a) => {
                  const hasDiscount = Number(a.SalePrice) > 0 && Number(a.SalePrice) < Number(a.ProductPrice)
                  const detailLink = `/detail?id=${a._id}&cid=${idd} `

                  return (
                    <div className="col-lg-3 col-md-4 col-6" key={a._id}>
                      <div className="related-product-card">
                        <Link to={detailLink} className="related-img-wrap shop-link-img">
                          <img src={`${a.Img}`} alt={a.ProductName} loading="lazy" />
                        </Link>

                        <div className="related-card-content">
                          <div className="mb-2 text-warning small">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-half"></i>
                            <i className="bi bi-star"></i>
                            <small className="text-muted ms-1">(4.3)</small>
                          </div>

                          <Link to={detailLink} className="text-decoration-none">
                            <h6 className="related-card-title" title={a.ProductName}>{a.ProductName}</h6>
                          </Link>

                          <div className="related-price-row">
                            <strong className="related-current-price">{inr(a.SalePrice || a.ProductPrice)}</strong>
                            {hasDiscount && <del className="related-original-price">{inr(a.ProductPrice)}</del>}
                          </div>

                          <Link to={detailLink} className="btn-card-buy text-decoration-none mt-auto">
                            View Product <i className="bi bi-arrow-right-short fs-6"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </section>

    </>
  )
}
