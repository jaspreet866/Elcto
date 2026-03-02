import { useState, useEffect, useContext } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import Swal from "sweetalert2"
import { Context } from "./usecontext"


export const Related = () => {
    const [d, setd] = useState([])
    const [datta, setdatta] = useState([])
    const { id } = useContext(Context)
    const [pr] = useSearchParams()
    const navigate = useNavigate()
    const prr = pr.get("id")

    useEffect(() => {
        show();
        show2()
    }, [])

    const show = async () => {
        const result = await fetch(`https://elcto-1.onrender.com/api/related/${prr}`, {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setd(res.data)

            }
            else {
                alert("error")
            }
        }
    }

    const show2 = async () => {
        const result = await fetch(`https://elcto-1.onrender.com/api/getbrand/${prr}`, {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setdatta(res.data)
            }
            else {
                alert("not")
            }
        }
    }
    const wish = async (id, name, price, img, prr) => {
        if (!prr || !id) return;
        const data = { id, name, price, img }
        const result = await fetch(`https://elcto-1.onrender.com/api/wishpost/${prr}`, {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result.ok) {
            const res = await result.json();

            if (res.statuscode === 2) {
                Swal.fire({
                    icon: "info",
                    title: "❤️ Already in Wishlist",
                    text: (res.message)
                })
            }

            else if (res.statuscode === 1) {
                navigate(`/wish?id=${id}`);
                Swal.fire({
                    icon: "success",
                    title: "❤️ Added in Wishlist",
                })
            }

            else {
                alert("Something went wrong");
            }

        }
    }
    const cart = async (id, name, price, img, value = 1, prr) => {
        if (!prr || !id) return;
        const data = { id, name, price, img, value }
        const result = await fetch(`https://elcto-1.onrender.com/api/cartdata/${prr}`, {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 2) {
                Swal.fire({
                    icon: "info",
                    title: "🛒 Already in Cart",
                    text: (res.message)
                });

            }
            else if (res.statuscode === 1) {
                navigate(`/cart?id=${id}`)
                Swal.fire({
                    icon: "success",
                    text: "🛒 Added to Cart"
                })
            }
            else {
                alert("Something Error")
            }
        }

    }

    return (
        <>
            <section className="s-page-title d-flex align-items-center justify-content-center text-center">
                <div className="container-fluid bread">
                    <div className="content">
                        <h1 className="title-page">Related</h1>

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
                                    Product's
                                </h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section>
                <div className="container mt-5">

                    <h1 className="text-center">SHOP BY BRAND</h1>

                    <div className="row mt-4 g-4">

                        {datta.map((a, i) => (
                            <div key={i} className="col-6 col-sm-4 col-md-3 col-lg-2 text-center">

                                <Link
                                    className="text-decoration-none text-black d-block"
                                    to={`/brand?id=${a._id}`}
                                >

                                    <img
                                        src={`/uploads/${a.Img}`}
                                        className="object-fit-cover rounded"
                                        style={{ width: "100px", height: "100px" }}
                                        alt=""
                                    />

                                    <h6 className="mt-2">{a.BrandName}</h6>

                                </Link>

                            </div>
                        ))}

                    </div>

                </div>
            </section>


            <div className="container mt-5">
                <h1>Our Collection</h1>

                <div className="row mt-4 g-4 justify-content-center">
                    {d.map((b) => (
                        <div key={b._id} className="col-lg-3 col-md-4 col-6 ">

                            <Link className="text-decoration-none text-black" to={`/detail?id=${b._id}&cid=${prr}`}>

                                <div className="card border-0 shadow-sm text-center p-3 w-100">
                                    <div className='cardicons justify-self-end'>

                                        <p className='text-danger btn' onClick={() => { wish(id, b.ProductName, b.ProductPrice, b.Img, b._id) }}><i class="bi bi-heart-fill"></i>
                                        </p><br></br>
                                        <p className="btn" onClick={() => { cart(id, b.ProductName, b.ProductPrice, b.Img, b.Quantity, b._id) }}><i class="bi bi-cart"></i></p>
                                        <p><i class="bi bi-eye"></i></p>
                                    </div>

                                    <div className="d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                        <img
                                            src={`/uploads/${b.Img}`}
                                            alt={b.ProductName}
                                            className="img-fluid"
                                            style={{ maxHeight: "120px" }}
                                        />
                                    </div>

                                    <div className="card-body p-0">
                                        <h6 className="fw-semibold mb-2">{b.ProductName}</h6>
                                        <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>

                                        <p className="mb-3">
                                            <span className=" me-2">₹{b.ProductPrice}</span>
                                            <span className="h6 fs-5 text-success fw-bold me-2">₹{b.SalePrice}</span>
                                        </p>

                                        <button className="btn btn-primary btn-sm w-75">
                                            View Product
                                        </button>
                                    </div>

                                </div>

                            </Link>

                        </div>
                    ))}
                </div>
            </div>

        </>
    )
}