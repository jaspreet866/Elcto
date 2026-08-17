import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Rating } from 'react-simple-star-rating'
import Swal from "sweetalert2"
import { Context } from "./usecontext"
import { motion } from 'framer-motion'
import { ImageModal } from "./ImageModal"
import { API_BASE } from "./apiConfig"

export const Detail = () => {
    const [pro, setpro] = useState("")
    const [value, setvalue] = useState(1)
    const [img, setimg] = useState()
    const [name, setname] = useState("")
    const [price, setprice] = useState("")
    const [saleprice, setsaleprice] = useState(0)
    const [stock, setstock] = useState(0)
    const [detail, setdetail] = useState("")
    const [specs, setSpecs] = useState("")
    const { id } = useContext(Context)
    const [idd, setidd] = useState("")
    const [rela, setrela] = useState([])
    const [pr] = useSearchParams()
    const prr = pr.get("id")
    const [catid] = useSearchParams()
    const catidd = catid.get("cid")
    const [username, setusername] = useState("")
    const [mail, setmail] = useState("")
    const [msg, setmsg] = useState("")
    const [rating, setrating] = useState(0)
    const [review, setreview] = useState([])
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("specifications");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ img: "", title: "", price: "", salePrice: "" });
    const [imgList, setImgList] = useState([]);

    const openImageModal = (imgSrc, titleText, itemPrice, itemSalePrice) => {
        setModalData({
            img: imgSrc,
            title: titleText,
            price: itemPrice,
            salePrice: itemSalePrice
        });
        setIsModalOpen(true);
    };
    useEffect(() => {
        show();
        show2()
        showreview()
    }, [prr])

    const show = async () => {
        const result = await fetch(`${API_BASE}/api/detail/${prr}`, {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setname(res.data.ProductName)
                setprice(res.data.ProductPrice)
                setsaleprice(res.data.SalePrice)
                setstock(Number(res.data.Stock) || 0)
                setpro(res.data.Category)
                setdetail(res.data.ProductDetail)
                if (res.data.Images && Array.isArray(res.data.Images) && res.data.Images.length > 0) {
                    setImgList(res.data.Images);
                    setimg(res.data.Images[0]);
                } else {
                    setimg(res.data.Img);
                    if (res.data.Img) setImgList([res.data.Img]);
                }
                setSpecs(res.data.Specifications)
                setidd(id)
            }
            else {
                alert("not")
            }
        }
    }
    const goto = async () => {
        if (Number(value) > stock) {
            Swal.fire("Stock unavailable", `Only ${stock} item${stock === 1 ? " is" : "s are"} available.`, "info")
            return
        }
        const data = { value, img, name, price, id, prr }
        const result = await fetch(`${API_BASE}/api/cartdata/${prr}`, {
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
                alert("error")
            }
        }
    }

    const show2 = async () => {
        const result = await fetch(`${API_BASE}/api/relatedtwo/${catidd}`, {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setrela(res.data)
            }
        }
        else {
            alert("not any")
        }
    }

    const wish = async () => {
        const data = { img, name, price, id, }
        const result = await fetch(`${API_BASE}/api/wishpost/${prr}`, {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result) {
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
    const wish2 = async (id, name, price, img, prr) => {
        const data = { id, name, price, img }
        const result = await fetch(`${API_BASE}/api/wishpost/${prr}`, {
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
        const data = { id, name, price, img, value }
        const result = await fetch(`${API_BASE}/api/cartdata/${prr}`, {
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
                alert("Something error")
            }
        }
    }
    const handleRating = (rate) => {
        setrating(rate)
    }

    const send = async (e) => {
        e.preventDefault()
        const data = { username, mail, prr, rating, msg }
        const result = await fetch("https://elcto-1.onrender.com/api/reviews", {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                Swal.fire({
                    icon: "success",
                    title: "Review Submitted",
                })
                setusername("")
                setmail("")
                setmsg("")
                setrating(0)
                showreview()
            }
            else {
                alert("not")
            }
        }
    }
    const showreview = async () => {
        const result = await fetch(`https://elcto-1.onrender.com/api/getreview/${prr}`, {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setreview(res.data)
            }
            else {
                alert("fgh")
            }
        }
    }



    return (
        <>
            <section>
                <div className="container my-5">
                    <div className="row g-5">
                        {/* Product Image */}
                        <div className="col-lg-6 text-center col-12">
                            <div 
                                className="position-relative d-inline-block rounded p-2 overflow-hidden shadow-sm hover-shadow transition-all"
                                style={{ cursor: "zoom-in" }}
                                onClick={() => openImageModal(img, name, price, saleprice)}
                                title="Click to view full image"
                            >
                                <motion.img
                                    src={`${img}`}
                                    className="img-fluid rounded"
                                    style={{ maxHeight: "420px", objectFit: "contain" }}
                                    alt={name}
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ duration: 0.4 }}
                                />
                                <div className="position-absolute bottom-0 end-0 m-3 px-3 py-1 bg-dark bg-opacity-75 text-white rounded-pill small">
                                    <i className="bi bi-arrows-angle-expand me-1"></i> Expand Image
                                </div>
                            </div>

                            {/* Multiple Images Thumbnail Gallery */}
                            {imgList.length > 1 && (
                                <div className="d-flex gap-2 justify-content-center mt-3 overflow-auto py-2">
                                    {imgList.map((thumbUrl, idx) => (
                                        <img
                                            key={idx}
                                            src={thumbUrl}
                                            alt={`${name} thumbnail ${idx + 1}`}
                                            className={`rounded border ${img === thumbUrl ? 'border-primary border-3 shadow' : 'opacity-75'}`}
                                            style={{ width: "65px", height: "65px", objectFit: "contain", cursor: "pointer", transition: "all 0.2s" }}
                                            onClick={() => setimg(thumbUrl)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="col-lg-6 col-12">
                            <h2>{name}</h2>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div>
                                    <span className="text-muted h6 text-decoration-line-through me-2">
                                        ₹{price}
                                    </span>
                                    <span className="text-success fw-bold h5  me-2">
                                        ₹{saleprice}
                                    </span>
                                </div>
                                <div>
                                    <i className="bi bi-star-fill star"></i>
                                    <i className="bi bi-star-fill star"></i>
                                    <i className="bi bi-star-fill star"></i>
                                    <i className="bi bi-star-fill star"></i>
                                    <i className="bi bi-star star-muted"></i>
                                    <span className="ms-2 text-muted">(4.0 / 5 | 128 Reviews)</span>
                                </div>
                            </div>

                            <hr />

                            <div className="text-start mt-3">
                                <h4>Description:</h4>
                                <p>{detail}</p>
                            </div>

                            <p className={`fw-semibold mb-0 ${stock > 0 ? "text-success" : "text-danger"}`}>
                                <i className={`bi ${stock > 0 ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-2`}></i>
                                {stock > 0 ? `${stock} item${stock === 1 ? "" : "s"} available in stock` : "Out of stock"}
                            </p>

                            <div className="d-flex align-items-center gap-3 mt-3">
                                <input
                                    type="number"
                                    min="1"
                                    max={stock}
                                    className="form-control w-25 text-center"
                                    value={value}
                                    onChange={(e) => setvalue(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={goto} disabled={stock < 1}>
                                    {stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                                </button>
                                <button
                                    className="btn text-danger "
                                    style={{ fontSize: "24px" }}
                                    onClick={wish}
                                >
                                    <i className="bi bi-heart-fill"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
           <section className="container mt-5">
    <div className="mt-4">

        {/* TAB HEADINGS */}
        <div className="d-flex gap-4 justify-content-center border-bottom pb-2">
            <h5
                role="button"
                onClick={() => setActiveTab("specifications")}
                className={`fw-semibold ${activeTab === "specifications"
                        ? "text-primary border-bottom border-3 border-primary pb-1"
                        : "text-muted"
                    }`}
            >
                Specifications
            </h5>

            <h5
                role="button"
                onClick={() => setActiveTab("reviews")}
                className={`fw-semibold ${activeTab === "reviews"
                        ? "text-primary border-bottom border-3 border-primary pb-1"
                        : "text-muted"
                    }`}
            >
                Reviews ({review.length})
            </h5>
        </div>


        <div className="mt-4">
            {activeTab === "specifications" && (
                <div className="text-start">
                    {specs ? (
                        <ul
                            className="list-unstyled"
                            style={{ fontSize: "15px", lineHeight: "1.8" }}
                        >
                            {specs.split("\n").map((line, index) => {
                                const [key, value] = line.split(":");
                                if (!key || !value) return null;
                                return (
                                    <li key={index} className="mb-2">
                                        <strong>{key}:</strong>{" "}
                                        <span className="text-muted">{value}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>No specifications available.</p>
                    )}
                </div>
            )}
            {activeTab === "reviews" && (
                <div className="row g-5">
                    <div className="col-lg-6 justify-content-center align-content-center col-12">
                        {review.length > 0 ? (
                            review.map((a, index) => (
                                <div key={index} className="card w-100 shadow-sm border-0 mb-3">
                                    <div className="card-body">

                                        <div className="d-flex align-items-center mb-2">
                                            <div
                                                className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{ width: "45px", height: "45px" }}
                                            >
                                                <span className="fw-bold text-primary">
                                                    {a.Name.charAt(0)}
                                                </span>
                                            </div>

                                            <div>
                                                <h6 className="mb-0 fw-bold">{a.Name}</h6>
                                                <small className="text-muted">
                                                    {a.Date.split("T")[0]}
                                                </small>
                                            </div>
                                        </div>

                                      <div className="text-start ms-4 ">
                                          <Rating 
                                            initialValue={parseFloat(a.Rating)}
                                            allowFraction
                                            size={18}
                                            readonly
                                        />
                                      </div>

                                        <p className="text-muted mt-2 mb-0">
                                            {a.Msg}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-5 bg-light rounded">
                                <h5>No Reviews Yet</h5>
                                <p className="text-muted">
                                    Be the first to review this product!
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="col-lg-6 col-12">
                        <div className="card w-100 border-0 bg-light p-4">
                            <h5 className="mb-3">Add Your Review</h5>

                            <form onSubmit={send}>
                                <div className="mb-3">
                                    <input
                                        className="form-control"
                                        placeholder="Enter Name"
                                        value={username}
                                        onChange={(e) => setusername(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter Email"
                                        value={mail}
                                        onChange={(e) => setmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="Write your review..."
                                        value={msg}
                                        onChange={(e) => setmsg(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="fw-semibold">Your Rating:</label>
                                    <Rating
                                        onClick={handleRating}
                                        allowFraction
                                    />
                                </div>

                                <button type="submit" className="btn btn-danger w-100">
                                    Send Review
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            )}

        </div>
    </div>
</section>


            <div className="container mt-5">
                <h2>You May Also Like</h2>
                <div className="row g-4 py-5">
                    {rela.map((a) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={a._id}>
                            <div className="card w-100 border-0 shadow-sm wishlist-card">
                                <div className='cardicons justify-self-end'>
                                    <p className='text-danger btn' onClick={() => { wish2(id, a.ProductName, a.ProductPrice, a.Img, a._id) }}><i className="bi bi-heart-fill"></i>
                                    </p>
                                    <p className="btn" onClick={() => { cart(id, a.ProductName, a.ProductPrice, a.Img, a.Quantity, a._id) }}><i className="bi bi-cart"></i></p>
                                    <p className="btn" onClick={() => openImageModal(a.Img, a.ProductName, a.ProductPrice, a.SalePrice)} title="Quick view image"><i className="bi bi-eye"></i></p>
                                </div>
                                <div className="cursor-pointer" onClick={() => openImageModal(a.Img, a.ProductName, a.ProductPrice, a.SalePrice)}>
                                    <img
                                        src={`${a.Img}`}
                                        className="card-img-top p-3"
                                        alt={a.ProductName}
                                        style={{ height: "140px", objectFit: "contain", cursor: "zoom-in" }}
                                    />
                                </div>

                                <div className="card-body d-flex flex-column">
                                    <h6 className="fw-semibold product-title">{a.ProductName}</h6>
  <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>
 <p className="d-flex justify-content-center align-self-center text-center">
                                        <span className=" ">
                                            ₹{a.ProductPrice}
                                        </span>
                                        <span className=" text-success fw-bold ms-1 ">
                                            ₹{a.SalePrice}
                                        </span>
                                        

                                    </p>
                                    <div className='d-flex flex-column flex-md-row gap-1'>
                                        <Link to={`/detail?id=${a._id}&cid=${catid} `} className="btn btn-primary btn-sm w-100 ">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-100 ' onClick={goto}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
            
            <ImageModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imgSrc={modalData.img}
                title={modalData.title}
                price={modalData.price}
                salePrice={modalData.salePrice}
            />
        </>
    )
}
