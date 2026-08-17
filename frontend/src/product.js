
import { useContext, useEffect, useState } from "react"
import { useSearchParams, Navigate } from "react-router-dom"
import Swal from "sweetalert2"
import { Context } from "./usecontext"
import { API_BASE } from "./apiConfig"


export const Product = () => {

    const PRODUCTS_PER_PAGE = 6

    const [product, setproduct] = useState("")
    const [idd, setidd] = useState("")
    const [name, setname] = useState("")
    const [price, setprice] = useState("")
    const [detail, setdetail] = useState("")
    const [images, setimages] = useState([])
    const [previews, setpreviews] = useState([])
    const [brand, setbrand] = useState("")
    const [datta, setdatta] = useState([])
    const [sale, setsale] = useState(false)
    const [saleprice, setsaleprice] = useState()
    const [specifications, setSpecifications] = useState("");
    const [allp, setallp] = useState([])
    const [stock, setstock] = useState()
    const [d, setd] = useState([])
    const [pid, setpid] = useState("")
    const { utype, id: vendorid } = useContext(Context)
    const [searchParams, setSearchParams] = useSearchParams()
    const requestedPage = Number(searchParams.get("page"))
    const currentPage = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
    const totalPages = Math.max(1, Math.ceil(allp.length / PRODUCTS_PER_PAGE))
    const activePage = Math.min(currentPage, totalPages)
    const paginatedProducts = allp.slice(
        (activePage - 1) * PRODUCTS_PER_PAGE,
        activePage * PRODUCTS_PER_PAGE
    )

    const changePage = (page) => {
        const nextPage = Math.min(Math.max(page, 1), totalPages)
        setSearchParams(nextPage === 1 ? {} : { page: String(nextPage) })
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setimages(prev => [...prev, ...files]);
            const filePreviews = files.map(file => URL.createObjectURL(file));
            setpreviews(prev => [...prev, ...filePreviews]);
        }
    };

    const removePreview = (index) => {
        setimages(prev => prev.filter((_, i) => i !== index));
        setpreviews(prev => prev.filter((_, i) => i !== index));
    };


    useEffect(() => {
        show();
        show3()
    }, [])
    useEffect(() => {
        if (pid) {
            show2()
        }
    }, [pid])

    const add = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("name", name)
        formData.append("productt", product)
        formData.append("price", price)
        if (images && images.length > 0) {
            images.forEach((file) => {
                formData.append("pic", file);
            });
        }
        formData.append("saleprice", saleprice)
        formData.append("detail", detail)
        formData.append("sale", sale)
        formData.append("brand", brand)
        formData.append("stock", stock)
        formData.append("Specifications", specifications);
        formData.append("vendorid", vendorid)

        const result = await fetch(`${API_BASE}/api/product`, {
            method: "post",
            body: formData
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                Swal.fire({
                    icon: "success",
                    text: "Product Added Successfully"
                })
                setimages([])
                setpreviews([])
                show3()
            }
            else {
                alert("not now")
            }
        }
    }
    const show = async (e) => {
        try {
            const result = await fetch(`${API_BASE}/api/getcategory`, {
                method: "get"
            })
            if (result && result.ok) {
                const res = await result.json()
                if (res.statuscode === 1) {
                    setd(res.data)
                }
            }
        } catch (err) {
            console.warn("Failed to fetch categories:", err)
        }
    }
    const show2 = async () => {
        try {
            const result = await fetch(`${API_BASE}/api/getbrand2/${pid}`, {
                method: "get"
            })
            if (result && result.ok) {
                const res = await result.json()
                if (res.statuscode === 1) {
                    setdatta(res.data)
                }
            }
        } catch (err) {
            console.warn("Failed to fetch brands:", err)
        }
    }
    const show3 = async () => {
        try {
            const result = await fetch(`${API_BASE}/api/getproduct`, {
                method: "get"
            })
            if (result && result.ok) {
                const res = await result.json()
                if (res.statuscode === 1) {
                    setallp(res.data)
                    const pageCount = Math.max(1, Math.ceil(res.data.length / PRODUCTS_PER_PAGE))
                    if (currentPage > pageCount) {
                        setSearchParams(pageCount === 1 ? {} : { page: String(pageCount) })
                    }
                }
            }
        } catch (err) {
            console.warn("Failed to fetch products:", err)
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

            const result = await fetch(`${API_BASE}/api/deletepro/${id}`, {
                method: "DELETE"
            });

            if (result.ok) {
                const res = await result.json();

                if (res.statuscode === 1) {

                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Product Removed"
                    });

                    show3();

                } else {
                    Swal.fire("Error", "Not Deleted", "error");
                }
            }

        } else {

            Swal.fire({
                icon: "info",
                title: "Cancelled",
                text: "Your Product is Safe 🙂"
            });

        }
    };


    const update = async (e) => {

        if (e && e.preventDefault) e.preventDefault()
        const formData2 = new FormData()
        formData2.append("name", name)
        formData2.append("productt", product)
        formData2.append("price", price)
        formData2.append("saleprice", saleprice)
        formData2.append("detail", detail)
        formData2.append("sale", sale)
        formData2.append("brand", brand)
        formData2.append("specifications", specifications)

        if (images && images.length > 0) {
            images.forEach((file) => {
                formData2.append("pic", file);
            });
        }

        const result = await fetch(`${API_BASE}/api/updatepro/${idd}`, {
            method: "PUT",
            body: formData2
        })

        if (result.ok) {
            const res = await result.json()

            if (res.statuscode === 1) {
                Swal.fire({
                    icon: "success",
                    title: "Updation",
                    text: "Updated Successfully"
                })
                setimages([])
                setpreviews([])
                show3()
            }
        }
    }
    const updatedata = (a) => {
        setidd(a._id)
        setname(a.ProductName)
        setprice(a.ProductPrice)
        setdetail(a.ProductDetail)
        setsale(a.OnSale)
        setsaleprice(a.SalePrice)
        setbrand(a.Brand)
        setproduct(a.Category)
        setSpecifications(a.Specifications)
        // setimg(a.Img)
    }



    return (
        <>
            {
                utype === "admin" || utype === "Vendor" ? <>
                    <section className="s-page-title d-flex align-items-center justify-content-center text-center">
                        <div className="container-fluid bread">
                            <div className="content">
                                <h1 className="title-page">Product</h1>

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
                                            Add Product
                                        </h6>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="container p-5">
                            <div className="row mt-4">
                                <div className="col col-lg-6 col-md-6 col-sm-12">
                                    <h1>Add Product</h1>
                                    <form onSubmit={add}>
                                        <select className="form-select" value={product} aria-label="Default select example " onChange={(e) => {
                                            setproduct(e.target.value)
                                            setpid(e.target.value)
                                        }}>
                                            <option>Select Category</option>
                                            {
                                                d.map((a) =>
                                                    <option value={a._id}>{a.Name}</option>

                                                )
                                            }
                                        </select>
                                        <select className="form-select mt-3" value={brand} aria-label="Default select example " onChange={(e) => setbrand(e.target.value)}>
                                            <option >Select Brand</option>
                                            {
                                                datta.map((a) =>
                                                    <option value={a._id}>{a.BrandName}</option>
                                                )
                                            }
                                        </select>
                                        <input type="text" className="form-control mt-3" value={name} placeholder="Product Name" onChange={(e) => setname(e.target.value)}></input>
                                        <textarea type="text" className="form-control mt-3" value={detail} placeholder="Product Description" onChange={(e) => setdetail(e.target.value)}></textarea>
                                        <textarea
                                            className="form-control mt-3"
                                            placeholder={`Specifications
Display: 6.7 inch OLED
Processor: A18
Camera: 48MP`} value={specifications}
                                            onChange={(e) => setSpecifications(e.target.value)}
                                        ></textarea>

                                        <input type="number" className="form-control mt-3" value={price} placeholder="Product Price" onChange={(e) => setprice(e.target.value)}></input>
                                        <div className="form-check form-switch mt-3">
                                            <input className="form-check-input" type="checkbox" checked={sale} onChange={(e) => setsale(e.target.checked)} />
                                            <label className="form-check-label" htmlFor="switchCheckChecked">On Sale</label>
                                        </div>
                                        <input type="number" className="form-control mt-3" value={stock} placeholder="Product Stock" onChange={(e) => setstock(e.target.value)}></input>

                                        <input type="number" className="form-control mt-3" value={saleprice} placeholder="Sale Price" onChange={(e) => setsaleprice(e.target.value)}></input>

                                        <div className="mb-3 mt-3">
                                            <label className="form-label fw-semibold text-muted">Upload Product Images (Select one or multiple):</label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                id="formFile"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            {previews.length > 0 && (
                                                <div className="d-flex flex-wrap gap-2 mt-3 p-2 border rounded bg-light">
                                                    {previews.map((src, index) => (
                                                        <div key={index} className="position-relative">
                                                            <img
                                                                src={src}
                                                                alt={`Preview ${index + 1}`}
                                                                className="rounded border"
                                                                style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 rounded-circle shadow-sm"
                                                                style={{ width: "22px", height: "22px", fontSize: "11px", lineHeight: "1" }}
                                                                onClick={() => removePreview(index)}
                                                                title="Remove image"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button type="submit" className="btn btn-primary">Add Product </button>
                                        <button type="button" className="btn ms-5 btn-danger" onClick={update}>Update</button>

                                    </form>
                                </div>
                                <div className="col">
                                    <h1>Product Details</h1>
                                    <div className="p-5">
                                        <div>
                                            <h6>Product Name: {name || "No Product"}</h6>
                                        </div>
                                        <div>
                                            <h6>Product Price: {price || "0"}</h6>
                                        </div>
                                        <div>
                                            <h6>Product Name: {detail || "Detail.."}</h6>
                                        </div>
                                        <div>
                                            <h6>On Sale: {saleprice || "0"}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="container">
                            {
                                paginatedProducts.map((a) =>
                                    <div key={a._id}>
                                        <div className="card  w-100 my-auto mt-3   " style={{ height: "auto" }}>
                                            <div className="d-flex align-items-center justify-content-between px-4 py-2">
                                                <div>
                                                    <img style={{ height: "80px", width: "80px" }} src={`${a.Img}`} alt={a.ProductName || 'product'} /></div>
                                                <div>
                                                    <p className="product-title">Name: {a.ProductName}</p>
                                                    <div className="d-flex gap-4">
                                                        <span>Price: {a.ProductPrice}</span><span>SalePrice: {a.SalePrice}</span>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <button className="btn btn-primary w-100" onClick={() => remove(a._id)}>Delete</button><br></br>
                                                    <button className="btn btn-danger mt-2" onClick={() => updatedata(a)}>Update</button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>)
                            }
                            {allp.length > PRODUCTS_PER_PAGE && (
                                <nav className="d-flex justify-content-center mt-4" aria-label="Product pagination">
                                    <ul className="pagination">
                                        <li className={`page-item ${activePage === 1 ? "disabled" : ""}`}>
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() => changePage(activePage - 1)}
                                                disabled={activePage === 1}
                                                aria-label="Previous page"
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                            <li key={page} className={`page-item ${page === activePage ? "active" : ""}`}>
                                                <button
                                                    type="button"
                                                    className="page-link"
                                                    onClick={() => changePage(page)}
                                                    aria-current={page === activePage ? "page" : undefined}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${activePage === totalPages ? "disabled" : ""}`}>
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() => changePage(activePage + 1)}
                                                disabled={activePage === totalPages}
                                                aria-label="Next page"
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </section>

                </> : <Navigate to="/" replace />
            }</>
    )
}
