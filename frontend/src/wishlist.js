import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import Swal from "sweetalert2"
import { Context } from "./usecontext"
import { SEO } from "./SEO"
import { API_BASE } from "./apiConfig"
import { inr } from "./format"
import "./Related.css"
import "./Shop.css"

export const Wish = () => {


    const [d, setd] = useState([])
    const [loading, setloading] = useState(true)
    const { id, setIsCartOpen, fetchCart } = useContext(Context)
    const navigate = useNavigate()
   

    useEffect(() => {
        show()
    }, [id])

    const show = async () => {
        if (!id) return;
        try {
            const result = await fetch(`${API_BASE}/api/getwish/${id}`, {
                method: "get"
            })
            if (result.ok) {
                const res = await result.json()
                if (res.statuscode === 1 && Array.isArray(res.data)) {
                    setd(res.data)
                }
                else {
                    setd([])
                }
            }
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
            setd([]);
        } finally {
            setloading(false)
        }
    }

    const cart = async (id, name, price, img, value = 1, prr) => {
        const data = { id, name, price, img, value, prr }
        try {
            const result = await fetch(`${API_BASE}/api/cartdata/${prr}`, {
                method: "post",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json;charset=UTF-8" }
            })
            if (result.ok) {
                const res = await result.json()
                if (res.statuscode === 1 || res.statuscode === 2) {
                    await fetchCart();
                    setIsCartOpen(true);
                }
            }
        } catch (err) {
            console.error("Failed to add from wishlist to cart:", err);
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
            try {
                const result = await fetch(`${API_BASE}/api/deletewish/${id}`, {
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
        } catch (err) {
            console.error("Failed to delete wishlist item:", err);
            Swal.fire("Error", "Server error deleting item", "error");
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
                title="My Wishlist"
                robots="noindex, nofollow"
            />
            <section className="s-page-title d-flex align-items-center justify-content-center text-center">
                <div className="container-fluid bread">
                    <div className="content">
                        <h1 className="title-page">Wishlist</h1>

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
                                    Wishlist
                                </h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="shop-page">
                <div className="container">
                    {!id ? (
                        <div className="shop-panel shop-empty">
                            <div className="shop-empty-icon">
                                <i className="bi bi-person-lock"></i>
                            </div>
                            <h2 className="shop-empty-title">Please Log In</h2>
                            <div className="shop-empty-text">You need to be logged in to view your wishlist.</div>
                            <Link to="/login" className="btn btn-primary shop-btn">Log In</Link>
                        </div>
                    ) : loading ? (
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
                                <i className="bi bi-heart"></i>
                            </div>
                            <h2 className="shop-empty-title">Your wishlist is empty</h2>
                            <div className="shop-empty-text">Tap the heart on any product to save it here for later.</div>
                            <Link to="/product" className="btn btn-primary shop-btn">
                                <i className="bi bi-grid"></i> Browse products
                            </Link>
                        </div>
                    ) : (
                        <div className="row g-3 g-md-4">
                            {d.map((a) => {
                                const hasDiscount = Number(a.SalePrice) > 0 && Number(a.SalePrice) < Number(a.Price)

                                return (
                                    <div className="col-lg-3 col-md-4 col-6" key={a._id}>
                                        <div className="related-product-card">
                                            <div className="related-img-wrap shop-static-img">
                                                <img src={`${a.Img}`} alt={a.Name} loading="lazy" />
                                            </div>

                                            <div className="related-card-content">
                                                <h6 className="related-card-title" title={a.Name}>
                                                    {a.Name}
                                                </h6>

                                                <div className="related-price-row">
                                                    <strong className="related-current-price">{inr(a.SalePrice || a.Price)}</strong>
                                                    {hasDiscount && <del className="related-original-price">{inr(a.Price)}</del>}
                                                </div>

                                                <div className="related-card-actions">
                                                    <button type="button" className="btn-card-detail" onClick={() => remove(a._id)}>
                                                        <i className="bi bi-trash3"></i> Remove
                                                    </button>
                                                    <button type="button" className="btn-card-buy" onClick={() => { cart(id, a.Name, a.Price, a.Img, a.Quantity, a._id) }}>
                                                        <i className="bi bi-cart-plus-fill"></i> Add to Cart
                                                    </button>
                                                </div>
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
