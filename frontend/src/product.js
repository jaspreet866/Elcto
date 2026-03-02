
import { useContext, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Swal from "sweetalert2"
import { Context } from "./usecontext"

export const Product = () => {

    const [product, setproduct] = useState("")
    const [idd, setidd] = useState("")
    const [name, setname] = useState("")
    const [price, setprice] = useState("")
    const [detail, setdetail] = useState("")
    const [img, setimg] = useState("")
    const [brand, setbrand] = useState("")
    const [datta, setdatta] = useState([])
    const [sale, setsale] = useState(false)
    const [saleprice, setsaleprice] = useState()
    const [specifications, setSpecifications] = useState("");
    const [allp, setallp] = useState([])
    const [d, setd] = useState([])
    const [id, setid] = useState("")
    const {utype}=useContext(Context)
    const navigate=useNavigate()


    useEffect(() => {
        show();
        show3()
    }, [])
    useEffect(() => {
        if (id) {
            show2()
        }
    }, [id])

    const add = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", name)
        formData.append("productt", product)
        formData.append("price", price)
        formData.append("pic", img)
        formData.append("saleprice", saleprice)
        formData.append("detail", detail)
        formData.append("sale", sale)
        formData.append("brand", brand)
        formData.append("Specifications", specifications);


        const result = await fetch("https://elcto-1.onrender.com/api/product", {
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
                show3()
            }
            else {
                alert("not now")
            }
        }
    }
    const show = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/getcategory", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setd(res.data)

            }
        }
    }
    const show2 = async () => {
        const result = await fetch(`https://elcto-1.onrender.com/api/getbrand2/${id}`, {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {

                setdatta(res.data)
            }
            else {
                alert("faileds")
            }
        }
    }
    const show3 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/getproduct", {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setallp(res.data)
            }
            else {
                alert("not found")
            }
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

            const result = await fetch(`https://elcto-1.onrender.com/api/deletepro/${id}`, {
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


    const update = async () => {
        const formData2 = new FormData()
        formData2.append("name", name)
        formData2.append("productt", product)
        formData2.append("price", price)
        formData2.append("pic", img)
        formData2.append("saleprice", saleprice)
        formData2.append("detail", detail)
        formData2.append("sale", sale)
        formData2.append("brand", brand)
        formData2.append("specifications", specifications);

        const result = await fetch(`https://elcto-1.onrender.com/api/updatepro/${idd}`, {
            method: "put",
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
            }
            else {
                alert("not")
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
    }



    return (
      <>
      {
        utype ==="admin"?  <>
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
                            <form>
                                <select className="form-select" value={product} aria-label="Default select example " onChange={(e) => {
                                    setproduct(e.target.value)
                                    setid(e.target.value)
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
                                <div class="form-check form-switch mt-3">
                                    <input class="form-check-input" type="checkbox" checked={sale} onChange={(e) => setsale(e.target.checked)} />
                                    <label class="form-check-label" for="switchCheckChecked">On Sale</label>
                                </div>

                                <input type="number" className="form-control mt-3" value={saleprice} placeholder="Sale Price" onChange={(e) => setsaleprice(e.target.value)}></input>

                                <div class="mb-3">

                                    <input class="form-control mt-3" type="file" id="formFile" onChange={(e) => setimg(e.target.files[0])} />
                                </div>
                                <button className="btn btn-primary" onClick={add}>Add Product </button>
                                <button className="btn ms-5 btn-danger" onClick={update}>Update</button>

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
                        allp.map((a) =>
                            <div key={a._id}>
                                <div className="card  w-100 my-auto mt-3   " style={{ height: "auto" }}>
                                    <div className="d-flex align-items-center justify-content-between px-4 py-2">
                                        <div>
                                            <img style={{ height: "80px", width: "80px" }} src={`/uploads/${a.Img}`}></img></div>
                                        <div>
                                            <p>Name: {a.ProductName}</p>
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
                </div>
            </section>

        </>:navigate("/")
}</>
    )
}