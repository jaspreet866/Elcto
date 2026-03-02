
import { useContext, useEffect, useState, } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import banner1 from './images/banner1.png'
import banner2 from './images/banner2.png'
import banner3 from './images/banner3.png'
import { Context } from './usecontext'
import Swal from 'sweetalert2'
import AOS from "aos"
import "aos/dist/aos.css"

export const Main = () => {
    const [d, setd] = useState([])
    const [spro, setspro] = useState([])
    const [lpro, setlpro] = useState([])
    const [br, setbr] = useState([])
    const [idd, setidd] = useState()
    const [laptop, setlaptop] = useState([])
    const [mobile, setmobile] = useState([])
    const [led, setled] = useState([])
    const [airpod, setairpod] = useState([])
    const { id } = useContext(Context)
    const [discount, setdiscount] = useState("")
    const [showTop, setShowTop] = useState(false);



    const navigate = useNavigate()

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
            offset: 120
        })
    }, [])

    setTimeout(() => {
        new window.Splide(".categorySlider", {
            perPage: 6,
            gap: 20,
            autoplay: true,
            arrows: false,
            pagination: false,
            breakpoints: {
                992: { perPage: 4, arrows: true },
                768: { perPage: 3, arrows: true },
                576: { perPage: 2, arrows: true },
            },
        }).mount();
    }, 300);

    useEffect(() => {
        show();
        show2();
        show3();
        show4();
        show5();
        show6()
        show7()
        show8()
    }, [])

    useEffect(() => {

        const handleScroll = () => {

            setShowTop(window.scrollY > window.innerHeight * 0.2);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);

    }, []);





   const show = async () => {
    try {
        const result = await fetch("https://elcto-1.onrender.com/api/getcategory");

        const res = await result.json();

        if (res.statuscode === 1) {
            setd(res.data);
            setidd(res.data[0]?.Category);
        } else {
            alert("Error from API");
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
};
    const show2 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/saleproduct", {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {

                setspro(res.data)
            }
            else {
                alert("bbfb")
            }
        }
    }
    const show3 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/latestproduct", {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setlpro(res.data)
            }
            else {
                alert("bbfb")
            }
        }
    }
    const show4 = async () => {
        const result = await fetch(" https://elcto-1.onrender.com/api/showbrand", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setbr(res.data)
            }
            else {
                alert("rere")
            }
        }
    }
    const show5 = async () => {
        const result = await fetch(`https://elcto-1.onrender.com/api/laptop`, {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setlaptop(res.data)

            }
            else {
                alert("not found")
            }
        }
    }
    const show6 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/mobiles", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setmobile(res.data)
            }
            else {
                alert("sdfg")
            }
        }
    }
    const show7 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/leds", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setled(res.data)
            }
            else {
                alert("dfg")
            }
        }
    }
    const show8 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/airpods", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setairpod(res.data)
            }
            else {
                alert("d")
            }
        }
    }

    const wish = async (id, name, price, img, prr) => {
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
                alert("dfg")
            }
        }
    }
    const gotop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
    const calculateDiscount = (original, sale) => {
        return Math.round(((original - sale) / original) * 100);
    }



    return (
        <>
            {/* <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel" data-aos="fade">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src={banner1} class="d-block w-100" alt="..." />
                    </div>
                    <div class="carousel-item">
                        <img src={banner2} class="d-block w-100" alt="..." />
                    </div>
                    <div class="carousel-item">
                        <img src={banner3} class="d-block w-100" alt="..." />
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div> */}
            <div className="container mt-5" data-aos="zoom-in">
                <h2 className="fw-bold text-center mb-4">Product Categories</h2>

                <div className="splide categorySlider mt-4 ">
                    <div className="splide__track">

                        <ul className="splide__list">

                            {d.map((a) => (
                                <li className="splide__slide" key={a._id}>

                                    <Link
                                        className="text-decoration-none"
                                        to={`/related?id=${a._id}`}
                                    >
                                        <div className="card border-0 shadow-sm text-center p-3 w-100 category-card">

                                            <img
                                                className="img-fluid mx-auto mb-2"
                                                src={`/uploads/${a.Img}`}
                                                alt={a.Name}
                                                style={{ maxWidth: "120px" }}
                                            />

                                            <p className="fw-semibold text-dark mb-0">
                                                {a.Name}
                                            </p>

                                        </div>
                                    </Link>

                                </li>
                            ))}

                        </ul>

                    </div>
                </div>

            </div>
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="cartCanvas">

                <div className="offcanvas-header">
                    <h5>Your Cart</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>

                <div className="offcanvas-body">


                    <button className="btn btn-dark w-50 mt-3">
                        Checkout
                    </button>

                </div>

            </div>
            <section className="container " data-aos="fade-up">
                <div className=" align-items-center  mt-5">
                    <h2 className="fw-bold">Latest Products</h2>
                    <span className="text-muted small">New arrivals just for you</span>
                </div>

                <div className="row g-4 mt-2">
                    {lpro.map((p) => (
                        <div key={p._id} className="col-lg-3 col-md-4 col-sm-4 col-6">


                            <div className="card w-100 border-0 card-sm- shadow-sm text-center p-3" data-aos="fade-up">
                                <div className='cardicons justify-self-end'>

                                    <p className='text-danger btn' onClick={() => { wish(id, p.ProductName, p.ProductPrice, p.Img, p._id) }}><i class="bi bi-heart-fill"></i>
                                    </p><br></br>
                                    <p className='btn' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}><i class="bi bi-cart"></i></p>
                                    <p><i class="bi bi-eye"></i></p>
                                </div>
                                <div
                                    className=" rounded d-flex justify-content-center align-items-center mb-3"
                                    style={{ height: "150px" }}
                                >
                                    <img
                                        src={`/uploads/${p.Img}`}
                                        alt={p.name}
                                        className="img-fluid rounded"
                                        style={{ height: "150px" }}
                                    />
                                </div>

                                <div className="card-body p-0">
                                    <h6 className="fw-semibold mb-2">{p.ProductName}</h6>
                                    <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>

                                    <p className="mb-3">
                                        <span className=" me-2">
                                            ₹{p.ProductPrice}
                                        </span>
                                        <span className="h6 text-success fw-bold fs-5 me-2">
                                            ₹{p.SalePrice}
                                        </span>
                                        

                                    </p>

                                    <div className='d-flex gap-3'>
                                        <Link to={`/detail?id=${p._id}&cid=${p.Category} `} className="btn btn-primary btn-sm w-50 ">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-50 ' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}>Add to Cart</button>
                                    </div>
                                </div>

                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <section className="container mt-5 py-3">
                <div className=" align-items-center mb-4 mt-5">
                    <h2 className="fw-bold">🔥 On Sale Products</h2>

                </div>

                <div className="row g-4">

                    {spro.map((p) => (
                        <div key={p._id} className="col-lg-3 col-6 col-md-4 col-sm-6">
                            <div className="card w-100 border-0 shadow-sm text-center p-3" data-aos="fade-up">
                                <div className="position-absolute top-0 start-0 h6">
                                    <span className="badge  bg-danger m-2">Off Upto:
                                        {calculateDiscount(p.ProductPrice, p.SalePrice)}%
                                    </span>
                                </div>
                                <div className='cardicons justify-self-end'>

                                    <p className='text-danger btn' onClick={() => { wish(id, p.ProductName, p.ProductPrice, p.Img) }}><i class="bi bi-heart-fill"></i>
                                    </p><br></br>
                                    <p className='btn' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity) }}><i class="bi bi-cart"></i></p>
                                    <p><i class="bi bi-eye"></i></p>
                                </div>
                                <div className=" rounded d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                    <img
                                        src={`/uploads/${p.Img}`}
                                        alt={p.name}
                                        className="img-fluid"
                                        style={{ maxHeight: "120px" }}
                                    />
                                </div>

                                <div className="card-body p-0">
                                    <h6 className="fw-semibold mb-2">{p.ProductName}</h6>
                                    <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>

                                    <p className="mb-3">
                                        <span className="text-muted  me-2">

                                            ₹{p.ProductPrice}
                                        </span>
                                        <span className="text-success fw-bold fs-5">
                                            ₹{p.SalePrice}
                                        </span>
                                    </p>
                                    <div className='d-flex gap-3'>
                                        <Link to={`/detail?id=${p._id}&cid=${p.Category} `} className="btn btn-primary btn-sm w-50">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-50 ' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <section className="container mt-5 py-3">
                <div className=" align-items-center mb-4 mt-5">
                    <h2 className="fw-bold">🔥 Our Mobile Collection</h2>

                </div>

                <div className="row g-4">
                    {mobile.map((p) => (
                        <div key={p._id} className="col-lg-3 col-6 col-md-4 col-sm-6">

                            <div className="card w-100 border-0 shadow-sm text-center p-3" data-aos="fade-up">
                                <div className='cardicons justify-self-end'>

                                    <p className='text-danger btn' onClick={() => { wish(id, p.ProductName, p.ProductPrice, p.Img, p._id) }}><i class="bi bi-heart-fill"></i>
                                    </p><br></br>
                                    <p className='btn' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}><i class="bi bi-cart"></i></p>
                                    <p><i class="bi bi-eye"></i></p>
                                </div>
                                <div className=" rounded d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                    <img
                                        src={`/uploads/${p.Img}`}
                                        alt={p.name}
                                        className="img-fluid"
                                        style={{ maxHeight: "120px" }}
                                    />
                                </div>

                                <div className="card-body p-0">
                                    <h6 className="fw-semibold mb-2">{p.ProductName}</h6>
                                    <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>

                                    <p className="mb-3">
                                        <span className="text-muted  me-2">

                                            ₹{p.ProductPrice}
                                        </span>
                                        <span className="text-success fw-bold fs-5">
                                            ₹{p.SalePrice}
                                        </span>
                                    </p>
                                    <div className='d-flex gap-3'>
                                        <Link to={`/detail?id=${p._id}&cid=${p.Category} `} className="btn btn-primary btn-sm w-50">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-50 ' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <section className="container mt-5 py-3">
                <div className=" align-items-center mb-4 mt-5">
                    <h2 className="fw-bold">🔥 Our Laptop Collection</h2>

                </div>

                <div className="row g-4">
                    {laptop.map((p) => (
                        <div key={p._id} className="col-lg-3 col-6 col-md-4 col-sm-6">

                            <div className="card w-100 border-0 shadow-sm text-center p-3" data-aos="fade-up">
                                <div className='cardicons justify-self-end'>

                                    <p className='text-danger btn' onClick={() => { wish(id, p.ProductName, p.ProductPrice, p.Img, p._id) }}><i class="bi bi-heart-fill"></i>
                                    </p><br></br>
                                    <p className='btn' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}><i class="bi bi-cart"></i></p>
                                    <p><i class="bi bi-eye"></i></p>
                                </div>
                                <div className=" rounded d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                    <img
                                        src={`/uploads/${p.Img}`}
                                        alt={p.name}
                                        className="img-fluid"
                                        style={{ maxHeight: "120px" }}
                                    />
                                </div>

                                <div className="card-body p-0">
                                    <h6 className="fw-semibold mb-2">{p.ProductName}</h6>
                                    <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>

                                    <p className="mb-3">
                                        <span className="text-muted  me-2">

                                            ₹{p.ProductPrice}
                                        </span>
                                        <span className="text-success fw-bold fs-5">
                                            ₹{p.SalePrice}
                                        </span>
                                    </p>

                                    <div className='d-flex gap-3'>
                                        <Link to={`/detail?id=${p._id}&cid=${p.Category} `} className="btn btn-primary btn-sm w-50">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-50 ' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <section className="container mt-5 py-3">
                <div className=" align-items-center mb-4 mt-5">
                    <h2 className="fw-bold">🔥 Our Airpods Collection</h2>

                </div>

                <div className="row g-4">
                    {airpod.map((p) => (
                        <div key={p._id} className="col-lg-3 col-6 col-md-4 col-sm-6">

                            <div className="card w-100 border-0 shadow-sm text-center p-3" data-aos="fade-up">
                                <div className='cardicons justify-self-end'>

                                    <p className='text-danger btn' onClick={() => { wish(id, p.ProductName, p.ProductPrice, p.Img, p._id) }}><i class="bi bi-heart-fill"></i>
                                    </p><br></br>
                                    <p className='btn' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}><i class="bi bi-cart"></i></p>
                                    <p><i class="bi bi-eye"></i></p>
                                </div>
                                <div className=" rounded d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                    <img
                                        src={`/uploads/${p.Img}`}
                                        alt={p.name}
                                        className="img-fluid"
                                        style={{ maxHeight: "120px" }}
                                    />
                                </div>

                                <div className="card-body p-0">
                                    <h6 className="fw-semibold mb-2">{p.ProductName}</h6>
                                    <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>

                                    <p className="mb-3">
                                        <span className="text-muted  me-2">

                                            ₹{p.ProductPrice}
                                        </span>
                                        <span className="text-success fw-bold fs-5">
                                            ₹{p.SalePrice}
                                        </span>
                                    </p>

                                    <div className='d-flex gap-3'>
                                        <Link to={`/detail?id=${p._id}&cid=${p.Category} `} className="btn btn-primary btn-sm w-50">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-50 ' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <section className="container mt-5 py-3">
                <div className=" align-items-center mb-4 mt-5">
                    <h2 className="fw-bold">🔥 Our Led Collection</h2>

                </div>

                <div className="row g-4">
                    {led.map((p) => (
                        <div key={p._id} className="col-lg-3 col-6 col-md-4 col-sm-6">

                            <div className="card w-100 border-0 shadow-sm text-center p-3" data-aos="fade-up">
                                <div className='cardicons justify-self-end'>

                                    <p className='text-danger btn' onClick={() => { wish(id, p.ProductName, p.ProductPrice, p.Img, p._id) }}><i class="bi bi-heart-fill"></i>
                                    </p><br></br>
                                    <p className='btn' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}><i class="bi bi-cart"></i></p>
                                    <p><i class="bi bi-eye"></i></p>
                                </div>
                                <div className=" rounded d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                    <img
                                        src={`/uploads/${p.Img}`}
                                        alt={p.name}
                                        className="img-fluid"
                                        style={{ maxHeight: "120px" }}
                                    />
                                </div>

                                <div className="card-body p-0">
                                    <h6 className="fw-semibold mb-2">{p.ProductName}</h6>
                                    <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>

                                    <p className="mb-3">
                                        <span className="text-muted  me-2">

                                            ₹{p.ProductPrice}
                                        </span>
                                        <span className="text-success fw-bold fs-5">
                                            ₹{p.SalePrice}
                                        </span>
                                    </p>

                                    <div className='d-flex gap-3'>
                                        <Link to={`/detail?id=${p._id}&cid=${p.Category} `} className="btn btn-primary btn-sm w-50">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-50 ' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <section className="container mt-5 py-4" data-aos="fade-up">
                <h2 className="fw-bold text-center mb-4">Why Choose Us</h2>
                <div className="row g-4 py-5">
                    <div className="col-md-3 col-6 text-center">
                        <i className="bi bi-truck fs-1 text-primary"></i>
                        <h6 className="mt-2">Free Shipping</h6>
                        <small className="text-muted">On orders above ₹999</small>
                    </div>
                    <div className="col-md-3 col-6 text-center">
                        <i className="bi bi-shield-check fs-1 text-success"></i>
                        <h6 className="mt-2">Secure Payment</h6>
                        <small className="text-muted">100% secure transactions</small>
                    </div>
                    <div className="col-md-3 col-6 text-center">
                        <i className="bi bi-arrow-repeat fs-1 text-warning"></i>
                        <h6 className="mt-2">Easy Returns</h6>
                        <small className="text-muted">7 days return policy</small>
                    </div>
                    <div className="col-md-3 col-6 text-center">
                        <i className="bi bi-headset fs-1 text-info"></i>
                        <h6 className="mt-2">24/7 Support</h6>
                        <small className="text-muted">Dedicated customer support</small>
                    </div>
                </div>
            </section>
            <section className="bg-light py-5 mt-5" data-aos="fade-up">
                <div className="container">
                    <h2 className="fw-bold text-center mb-4">What Our Customers Say</h2>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <div className="card w-100 h-100 border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <i className="bi bi-star-fill text-warning"></i>
                                    <i className="bi bi-star-fill text-warning"></i>
                                    <i className="bi bi-star-fill text-warning"></i>
                                    <i className="bi bi-star-fill text-warning"></i>
                                    <i className="bi bi-star-fill text-warning"></i>
                                    <p className="mt-3">"Amazing products and fast delivery!"</p>
                                    <h6 className="fw-bold">- John Doe</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
    <div className="card w-100 h-100 border-0 shadow-sm">
        <div className="card-body text-center">
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-half text-warning"></i>
            <p className="mt-3">"Great quality and excellent customer support."</p>
            <h6 className="fw-bold">- Sarah Williams</h6>
        </div>
    </div>
</div>

<div className="col-md-4 mb-3">
    <div className="card w-100 h-100 border-0 shadow-sm">
        <div className="card-body text-center">
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <p className="mt-3">"Very satisfied with my purchase. Highly recommended!"</p>
            <h6 className="fw-bold">- Michael Brown</h6>
        </div>
    </div>
</div>
                    </div>
                </div>
            </section>
            <section>
                <div className="container mt-5" >
                    <h2>Trusted By</h2>

                    <div className="marquee py-5">
                        <div className="marquee-content gap-5">
                            {br.concat(br).map((a, index) => (
                                <img key={index} className='rounded-4 object-fit-cover' src={`/uploads/${a.Img}`} height="100px" alt="brand" />
                            ))}
                        </div>
                    </div>


                </div>
            </section>

            {showTop && (
                <div id='goTopBtn' className=' position-fixed bottom-0 end-0 me-4 mb-4 '
                    onClick={gotop}
                    style={{ zIndex: 999 }}>

                    <i className="bi bi-arrow-up-circle-fill"></i>

                </div>
            )}
        </>
    )
};
