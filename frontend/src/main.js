import API_URL from "./config"
import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import banner2 from './images/banner2.png'
import banner1 from './images/banner1.png'
import banner3 from './images/banner3.png'
import { Context } from './usecontext'
import Swal from 'sweetalert2'
import AOS from "aos"
import "aos/dist/aos.css"

const API_BASE = `${API_URL}/api`

const sections = [
    { key: "latest", title: "Latest Products", eyebrow: "New arrivals", icon: "bi-stars" },
    { key: "sale", title: "On Sale Products", eyebrow: "Limited-time deals", icon: "bi-lightning-charge-fill" },
    { key: "mobile", title: "Mobile Collection", eyebrow: "Phones for every budget", icon: "bi-phone" },
    { key: "laptop", title: "Laptop Collection", eyebrow: "Work, gaming and study", icon: "bi-laptop" },
    { key: "airpod", title: "Audio Collection", eyebrow: "Wireless sound essentials", icon: "bi-earbuds" },
    { key: "led", title: "LED Collection", eyebrow: "Home entertainment upgrades", icon: "bi-tv" },
]

const fetchJson = async (path) => {
    const response = await fetch(`${API_BASE}${path}`)
    if (!response.ok) throw new Error(`Request failed: ${path}`)
    return response.json()
}

const formatPrice = (value) => {
    const amount = Number(value || 0)
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount)
}

const calculateDiscount = (original, sale) => {
    const originalPrice = Number(original)
    const salePrice = Number(sale)
    if (!originalPrice || !salePrice || salePrice >= originalPrice) return 0
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

const Rating = () => (
    <div className="product-rating" aria-label="Rated 4.3 out of 5">
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-half"></i>
        <i className="bi bi-star"></i>
        <span>(4.3)</span>
    </div>
)

export const Main = () => {
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState({
        latest: [],
        sale: [],
        laptop: [],
        mobile: [],
        led: [],
        airpod: [],
    })
    const [brands, setBrands] = useState([])
    const [loading, setLoading] = useState(true)
    const [showTop, setShowTop] = useState(false)
    const { id } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        AOS.init({
            duration: 650,
            easing: "ease-out",
            once: true,
            offset: 80,
        })
    }, [])

    useEffect(() => {
        let active = true

        const loadStorefront = async () => {
            try {
                const [
                    categoryRes,
                    saleRes,
                    latestRes,
                    brandRes,
                    laptopRes,
                    mobileRes,
                    ledRes,
                    airpodRes,
                ] = await Promise.all([
                    fetchJson("/getcategory"),
                    fetchJson("/saleproduct"),
                    fetchJson("/latestproduct"),
                    fetchJson("/showbrand"),
                    fetchJson("/laptop"),
                    fetchJson("/mobiles"),
                    fetchJson("/leds"),
                    fetchJson("/airpods"),
                ])

                if (!active) return

                setCategories(categoryRes.statuscode === 1 ? categoryRes.data : [])
                setBrands(brandRes.statuscode === 1 ? brandRes.data : [])
                setProducts({
                    latest: latestRes.statuscode === 1 ? latestRes.data : [],
                    sale: saleRes.statuscode === 1 ? saleRes.data : [],
                    laptop: laptopRes.statuscode === 1 ? laptopRes.data : [],
                    mobile: mobileRes.statuscode === 1 ? mobileRes.data : [],
                    led: ledRes.statuscode === 1 ? ledRes.data : [],
                    airpod: airpodRes.statuscode === 1 ? airpodRes.data : [],
                })
            } catch (error) {
                console.error("Storefront load failed:", error)
                Swal.fire({
                    icon: "error",
                    title: "Store temporarily unavailable",
                    text: "Please refresh in a moment.",
                })
            } finally {
                if (active) setLoading(false)
            }
        }

        loadStorefront()

        return () => {
            active = false
        }
    }, [])

    useEffect(() => {
        if (!categories.length || !window.Splide) return

        const slider = new window.Splide(".categorySlider", {
            perPage: 6,
            gap: 18,
            autoplay: true,
            interval: 2600,
            arrows: false,
            pagination: false,
            breakpoints: {
                1200: { perPage: 5 },
                992: { perPage: 4, arrows: true },
                768: { perPage: 3, arrows: true },
                576: { perPage: 2, arrows: true },
            },
        })

        slider.mount()
        return () => slider.destroy()
    }, [categories])

    useEffect(() => {
        const handleScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.2)
        window.addEventListener("scroll", handleScroll)
        handleScroll()

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const productCount = useMemo(
        () => Object.values(products).reduce((total, list) => total + list.length, 0),
        [products]
    )

    const requireLogin = () => {
        Swal.fire({
            icon: "warning",
            title: "Please login first",
            text: "Login to save items and checkout faster.",
        })
        navigate("/login")
    }

    const wish = async (userId, name, price, img, productId, saleprice) => {
        if (!userId) {
            requireLogin()
            return
        }

        const data = { id: userId, name, price, img, prr: productId, saleprice }
        const result = await fetch(`${API_BASE}/wishpost/${productId}`, {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })

        if (!result.ok) return
        const res = await result.json()

        if (res.statuscode === 2) {
            Swal.fire({ icon: "info", title: "Already in Wishlist", text: res.message })
            return
        }

        if (res.statuscode === 1) {
            navigate(`/wish?id=${userId}`)
            Swal.fire({ icon: "success", title: "Added to Wishlist" })
        }
    }

    const cart = async (userId, name, price, img, value = 1, productId) => {
        if (!userId) {
            requireLogin()
            return
        }

        const data = { id: userId, name, price, img, value }
        const result = await fetch(`${API_BASE}/cartdata/${productId}`, {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })

        if (!result.ok) return
        const res = await result.json()

        if (res.statuscode === 2) {
            Swal.fire({ icon: "info", title: "Already in Cart", text: res.message })
            return
        }

        if (res.statuscode === 1) {
            navigate(`/cart?id=${userId}`)
            Swal.fire({ icon: "success", text: "Added to Cart" })
        }
    }

    const gotop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const renderProductCard = (p, sectionKey) => {
        const discount = calculateDiscount(p.ProductPrice, p.SalePrice)
        const salePrice = p.SalePrice || p.ProductPrice

        return (
            <div key={`${sectionKey}-${p._id}`} className="col-xl-3 col-lg-4 col-sm-6 col-6">
                <article className="product-card" data-aos="fade-up">
                    {discount > 0 && (
                        <span className="product-badge">{discount}% off</span>
                    )}

                    <div className="cardicons" aria-label="Product actions">
                        <button type="button" title="Add to wishlist" onClick={() => wish(id, p.ProductName, p.ProductPrice, p.Img, p._id, p.SalePrice)}>
                            <i className="bi bi-heart-fill"></i>
                        </button>
                        <button type="button" title="Add to cart" onClick={() => cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id)}>
                            <i className="bi bi-cart"></i>
                        </button>
                        <Link title="View product" to={`/detail?id=${p._id}&cid=${p.Category}`}>
                            <i className="bi bi-eye"></i>
                        </Link>
                    </div>

                    <Link className="product-media" to={`/detail?id=${p._id}&cid=${p.Category}`}>
                        <img src={p.Img} alt={p.ProductName} loading="lazy" />
                    </Link>

                    <div className="product-card-body">
                        <p className="product-kicker">{p.Brand || "Electronics"}</p>
                        <h3 className="product-title">{p.ProductName}</h3>
                        <Rating />
                        <div className="price-section">
                            {discount > 0 && <span className="old-price">{formatPrice(p.ProductPrice)}</span>}
                            <span className="new-price">{formatPrice(salePrice)}</span>
                        </div>
                    </div>

                    <div className="product-actions">
                        <Link to={`/detail?id=${p._id}&cid=${p.Category}`} className="btn btn-outline-dark btn-sm">
                            View
                        </Link>
                        <button className="btn btn-danger btn-sm" onClick={() => cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id)}>
                            Add to Cart
                        </button>
                    </div>
                </article>
            </div>
        )
    }

    const renderSection = ({ key, title, eyebrow, icon }) => {
        const list = products[key] || []

        if (!loading && !list.length) return null

        return (
            <section className="store-section" data-aos="fade-up" key={key}>
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-eyebrow"><i className={`bi ${icon}`}></i>{eyebrow}</span>
                            <h2>{title}</h2>
                        </div>
                        <Link to="/category" className="section-link">Explore all</Link>
                    </div>

                    <div className="row g-3 g-lg-4">
                        {loading
                            ? Array.from({ length: 4 }).map((_, index) => (
                                <div className="col-xl-3 col-lg-4 col-sm-6 col-6" key={`${key}-skeleton-${index}`}>
                                    <div className="product-card product-card-skeleton"></div>
                                </div>
                            ))
                            : list.map((product) => renderProductCard(product, key))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <>
            <section className="hero-wrap">
                <div className="container">
                    <div id="carouselExample" className="carousel slide hero-carousel" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {[banner1, banner2, banner3].map((banner, index) => (
                                <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={banner}>
                                    <img src={banner} className="d-block w-100" alt={`ElectoMart offer ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>

                    <div className="hero-stats" aria-label="Store highlights">
                        <div><strong>{productCount || "500+"}</strong><span>Curated products</span></div>
                        <div><strong>7 day</strong><span>Easy returns</span></div>
                        <div><strong>24/7</strong><span>Support desk</span></div>
                    </div>
                </div>
            </section>

            <section className="category-section" data-aos="zoom-in">
                <div className="container">
                    <div className="section-heading centered">
                        <div>
                            <span className="section-eyebrow"><i className="bi bi-grid-3x3-gap-fill"></i>Shop by department</span>
                            <h2>Product Categories</h2>
                        </div>
                    </div>

                    <div className="splide categorySlider">
                        <div className="splide__track">
                            <ul className="splide__list">
                                {categories.map((category) => (
                                    <li className="splide__slide" key={category._id}>
                                        <Link className="category-card" to={`/related?id=${category._id}`}>
                                            <span className="category-image">
                                                <img src={`/uploads/${category.Img}`} alt={category.Name} loading="lazy" />
                                            </span>
                                            <span>{category.Name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {sections.map(renderSection)}

            <section className="trust-section" data-aos="fade-up">
                <div className="container">
                    <div className="trust-grid">
                        <div>
                            <i className="bi bi-truck"></i>
                            <h3>Free Shipping</h3>
                            <p>On orders above ₹999</p>
                        </div>
                        <div>
                            <i className="bi bi-shield-check"></i>
                            <h3>Secure Payment</h3>
                            <p>Encrypted checkout flow</p>
                        </div>
                        <div>
                            <i className="bi bi-arrow-repeat"></i>
                            <h3>Easy Returns</h3>
                            <p>7 day replacement support</p>
                        </div>
                        <div>
                            <i className="bi bi-headset"></i>
                            <h3>24/7 Support</h3>
                            <p>Help when you need it</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="testimonial-section" data-aos="fade-up">
                <div className="container">
                    <div className="section-heading centered">
                        <div>
                            <span className="section-eyebrow"><i className="bi bi-chat-heart"></i>Customer voices</span>
                            <h2>What Our Customers Say</h2>
                        </div>
                    </div>
                    <div className="row g-4">
                        {[
                            ["Amazing products and fast delivery!", "John Doe"],
                            ["Great quality and excellent customer support.", "Sarah Williams"],
                            ["Very satisfied with my purchase. Highly recommended!", "Michael Brown"],
                        ].map(([review, name]) => (
                            <div className="col-md-4" key={name}>
                                <article className="testimonial-card">
                                    <Rating />
                                    <p>"{review}"</p>
                                    <h3>{name}</h3>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {!!brands.length && (
                <section className="brand-section">
                    <div className="container">
                        <div className="section-heading centered">
                            <div>
                                <span className="section-eyebrow"><i className="bi bi-patch-check"></i>Trusted ecosystem</span>
                                <h2>Trusted By</h2>
                            </div>
                        </div>
                        <div className="marquee">
                            <div className="marquee-content">
                                {brands.concat(brands).map((brand, index) => (
                                    <img key={`${brand._id}-${index}`} src={`/uploads/${brand.Img}`} alt={brand.Name || "Brand"} loading="lazy" />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {showTop && (
                <button id="goTopBtn" type="button" onClick={gotop} aria-label="Back to top">
                    <i className="bi bi-arrow-up"></i>
                </button>
            )}
        </>
    )
}
