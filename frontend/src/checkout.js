import { useContext, useEffect, useState } from "react"
import { Context } from "./usecontext"
import Swal from "sweetalert2"
import { useLocation, useSearchParams } from "react-router-dom"

export const Check = () => {

    const [fname, setfname] = useState("")
    const [lname, setlname] = useState("")
    const [phn, setphn] = useState()
    const [email, setemail] = useState("")
    const [country, setcountry] = useState("")
    const [state, setstate] = useState("")
    const [city, setcity] = useState("")
    const [postal, setpostal] = useState()
    const [address, setaddress] = useState("")
    const [d, setd] = useState([])
    const location = useLocation()
    const orderno = Math.floor(Math.random() * 1000)
    const [payment, setpayment] = useState("")
    const { totalprice } = location.state || {};
    const [idd] = useSearchParams()
    const id = idd.get("id")

    useEffect(() => {
        show()
    }, [id])

    const save = async () => {
        const items = d.map(item => ({
            ProductName: item.Name,
            Quantity: item.Quantity,
            Price: item.Price,
            Img:item.Img
        }))
        const data = { fname, lname, phn, email, country, state, city, postal, address, id, payment, orderno, totalprice, data: items }
        const result = await fetch("https://elcto-1.onrender.com/api/checkout", {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
              Swal.fire({
                icon:"success",
                title:"Thanks You ",
                text:"Visit Again"
              })
            }
            else {
                alert("not")
            }
        }
    }

    const show = async () => {
        const result = await fetch(`https://elcto-1.onrender.com/getcartdata/${id}`, {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setd(res.data)
            }
            else {
                alert("nothing in cart")
            }
        }
    }
    const deletecart = async () => {
        const result = await fetch(`https://elcto-1.onrender.com/api/removecartdata/${id}`, {
            method: "delete"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {

            }
            else {
                alert("not")
            }
        }
    }


    return (
        <>
            <section className="s-page-title d-flex align-items-center justify-content-center text-center">
                <div className="container-fluid bread">
                    <div className="content">
                        <h1 className="title-page">Checkout</h1>

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
                                    Checkout
                                </h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-lg-7 mt-5">
                        <form>
                            <div className="d-flex gap-3 mb-2">
                                <input className="form-control w-50" placeholder="First Name" onChange={(e) => setfname(e.target.value)}></input>
                                <input className="form-control w-50" placeholder="Last Name" onChange={(e) => setlname(e.target.value)}></input>
                            </div>
                            <div className="d-flex gap-3 mb-2">
                                <input className="form-control w-50" placeholder="Phone No." onChange={(e) => setphn(e.target.value)}></input>
                                <input className="form-control w-50" placeholder="E-Mail" onChange={(e) => setemail(e.target.value)}></input>
                            </div>
                            <select className="form-select mb-2" onChange={(e) => setcountry(e.target.value)}>
                                <option>Selct Country</option>
                                <option>India</option>
                                <option>Australia</option>
                                <option>Cananda</option>
                                <option>U.S.</option>
                                <option>Japan</option>
                                <option>China</option>

                            </select>

                            <div className="d-flex gap-3 mb-2">
                                <input className="form-control w-50" placeholder="State" onChange={(e) => setstate(e.target.value)}></input>
                                <input className="form-control w-50" placeholder="City" onChange={(e) => setcity(e.target.value)}></input>
                            </div>
                            <div className="d-flex gap-3 mb-2">
                                <input className="form-control w-50" placeholder="Pin Code" onChange={(e) => setpostal(e.target.value)}></input>
                                <input className="form-control w-50" placeholder="Address" onChange={(e) => setaddress(e.target.value)}></input>
                            </div>
                        </form>
                        <div className="card p-4 w-100">
                            <h5 className="mb-3">Choose Payment Option</h5>

                            <div className="accordion" id="payment-method-box">
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <label className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#credit-card-payment">
                                            <input type="radio" name="payment" className="form-check-input me-2" onChange={(e) => setpayment("Credit Card")} /> Credit Card
                                        </label>
                                    </h2>
                                    <div id="credit-card-payment" className="accordion-collapse collapse" data-bs-parent="#payment-method-box"  >
                                        <div className="accordion-body">
                                            <div className="mb-3">
                                                <input className="form-control" placeholder="Name on card" />
                                            </div>

                                            <div className="mb-3">
                                                <input className="form-control" placeholder="Card number" />
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <input type="month" className="form-control" />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <input className="form-control" placeholder="Postal code" />
                                                </div>
                                            </div>

                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="saveCard" />
                                                <label className="form-check-label" htmlFor="saveCard">
                                                    Save card details
                                                </label>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <label className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#cod-payment" >
                                            <input type="radio" value="Cash On Delivery" name="payment" className="form-check-input me-2" onChange={(e) => setpayment("Cash on Delivery")} />
                                            Cash On Delivery
                                        </label>
                                    </h2>
                                    <div id="cod-payment" className="accordion-collapse collapse" data-bs-parent="#payment-method-box" >
                                        <div className="accordion-body">
                                            Pay when your order is delivered.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <label className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#paypal-payment" >
                                            <input type="radio" name="payment" className="form-check-input me-2" onChange={(e) => setpayment("Online via Paypal")} />
                                            PayPal
                                        </label>
                                    </h2>
                                    <div id="paypal-payment" className="accordion-collapse collapse" data-bs-parent="#payment-method-box" >
                                        <div className="accordion-body">
                                            You will be redirected to PayPal to complete your payment.
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <p className="text-muted small mt-3">
                                Your personal data will be used to process your order and support your
                                experience on this website.
                            </p>

                            <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox" id="agree" />
                                <label className="form-check-label" htmlFor="agree">
                                    I agree to the <span className="text-primary">terms & conditions</span>
                                </label>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary btn-lg mt-3"
                            onClick={async () => {
                                await save()
                                await deletecart()
                            }}
                        >
                            Checkout
                        </button>
                    </div>
                    <div className="col mt-5" >
                        <div className="card shadow-sm w-100 text-center">
                            <div className="card-body">
                                <h3 className="card-title mb-3">Your Order Details</h3>

                                <table className="table align-middle mb-0 ">
                                    <tbody>
                                        {d.map((a) => (
                                            <tr key={a._id}>
                                                <td style={{ width: "50px" }}>
                                                    <img
                                                        src={`/uploads/${a.Img}`}
                                                        alt={a.Name}
                                                        className="img-fluid rounded"
                                                        style={{ height: "40px", width: "40px", objectFit: "cover" }}
                                                    />
                                                </td>

                                                <td>
                                                    <p className="mb-0 fw-semibold">{a.Name}</p>
                                                    <small className="text-muted">Qty: {a.Quantity}</small>
                                                </td>

                                                <td className="text-end fw-semibold">
                                                    ₹{a.Price * a.Quantity}
                                                </td>
                                            </tr>

                                        ))}
                                    </tbody>

                                </table>
                                <h3 className="mt-3">Total:{totalprice}</h3>
                                {payment}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}