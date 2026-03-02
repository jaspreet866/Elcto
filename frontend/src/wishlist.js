import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import Swal from "sweetalert2"
import { Context } from "./usecontext"

export const Wish = () => {


    const [d, setd] = useState([])
    const { id } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        show()
    }, [id])

    const show = async (e) => {

        const result = await fetch(`https://elcto-1.onrender.com/api/getwish/${id}`, {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setd(res.data)
            }
            else {
                alert("ojoj")
            }
        }
    }

    const cart = async (id, name, price, img, value = 1) => {
        const data = { id, name, price, img, value }
        const result = await fetch("https://elcto-1.onrender.com/api/cartdata", {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                navigate(`/cart?id=${id}`)
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

            const result = await fetch(`https://elcto-1.onrender.com/api/deletewish/${id}`, {
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
            <section className="s-page-title d-flex align-items-center justify-content-center text-center">
                <div className="container-fluid bread">
                    <div className="content">
                        <h1 className="title-page">Wishlist</h1>

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
                                    Wishlist
                                </h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <div className="container mt-5">
                <div className="row g-4">
                    {d.map((a) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={a._id}>
                            <div className="card  w-100 shadow-sm wishlist-card">


                                <div className="position-relative">
                                    <img
                                        src={`/uploads/${a.Img}`}
                                        className="card-img-top p-3"
                                        alt="product"
                                        style={{ height: "200px", objectFit: "contain" }}
                                    />
                                </div>


                                <div className="card-body d-flex flex-column">
                                    <h6 className="card-title text-truncate">
                                        {a.Name}
                                    </h6>

                                    <h5 className="fw-bold  mb-3">
                                        ₹{a.Price}
                                    </h5>

                                    <div className="d-flex gap-3">

                                        <button onClick={() => { cart(id, a.Name, a.Price, a.Img, a.Quantity) }} className="btn btn-sm btn-primary mt-auto w-50">Add to Cart </button>

                                        <button className="btn btn-danger mt-auto w-50" onClick={() => remove(a._id)}>
                                            Remove
                                        </button>
                                    </div>

                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>
    )
}