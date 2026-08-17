import { useCallback, useEffect, useMemo, useState } from "react"
import Swal from "sweetalert2"
import { useLocation, useSearchParams } from "react-router-dom"
import { API_BASE } from "./apiConfig"

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
    const [agree, setagree] = useState(false)
    const [saving, setsaving] = useState(false)
    const { totalprice } = location.state || {};
    const [idd] = useSearchParams()
    const id = idd.get("id")
    const orderTotal = useMemo(() => {
        return totalprice || d.reduce((acc, item) => acc + (item.Quantity * item.Price), 0)
    }, [d, totalprice])

    const show = useCallback(async () => {
        const result = await fetch(`${API_BASE}/api/getcartdata/${id}`, {
            method: "get"
        })
        const res = await result.json()
        if (result.ok) {
            if (res.statuscode === 1) {
                setd(res.data)
            }
            else {
                alert("nothing in cart")
            }
        }
    }, [id])

    useEffect(() => {
        show()
    }, [show])

    const save = async () => {
        const items = d.map(item => ({
            ProductName: item.Name,
            Quantity: item.Quantity,
            Price: item.Price,
            Img: item.Img
        }))
        const data = { fname, lname, phn, email, country, state, city, postal, address, id, payment, orderno, totalprice: orderTotal, data: items }
        const result = await fetch(`${API_BASE}/api/checkout`, {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        const res = await result.json()
        if (result.ok) {
            if (res.statuscode === 1) {
                Swal.fire({
                    icon: "success",
                    title: "Thank You",
                    text: "Visit Again"
                })
                return true
            }
            else {
                Swal.fire("Error", res.message || "Order could not be placed", "error")
            }
        } else {
            Swal.fire("Error", res.message || "Order could not be placed", "error")
        }
        return false
    }

    const deletecart = async () => {
        const result = await fetch(`${API_BASE}/api/removecartdata/${id}`, {
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

    const handleCheckout = async (e) => {
        e.preventDefault()

        if (!d.length) {
            Swal.fire("Cart is empty", "Please add products before checkout.", "info")
            return
        }

        if (!payment) {
            Swal.fire("Select payment", "Please choose a payment option.", "info")
            return
        }

        if (!agree) {
            Swal.fire("Terms required", "Please accept the terms & conditions.", "info")
            return
        }

        setsaving(true)
        const saved = await save()
        if (saved) {
            await deletecart()
        }
        setsaving(false)
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
            <section className="checkout-page">
                <div className="container">
                    <div className="row g-4 align-items-start">
                        <div className="col-12 col-lg-5 order-lg-2">
                            <div className="card checkout-card checkout-summary-card">
                                <div className="card-body p-4">
                                    <h3 className="card-title mb-4">Your Order Details</h3>

                                    <div className="table-responsive">
                                        <table className="table align-middle mb-0 checkout-table">
                                    <tbody>
                                        {d.map((a) => (
                                            <tr key={a._id}>
                                                <td className="checkout-product-img-cell">
                                                    <img
                                                        src={`${a.Img}`}
                                                        alt={a.Name}
                                                        className="checkout-product-img"
                                                    />
                                                </td>

                                                <td>
                                                    <p className="mb-0 fw-semibold product-title">{a.Name}</p>
                                                    <small className="text-muted">Qty: {a.Quantity}</small>
                                                </td>

                                                <td className="text-end fw-semibold checkout-price">
                                                    ₹{a.Price * a.Quantity}
                                                </td>
                                            </tr>

                                        ))}
                                    </tbody>

                                        </table>
                                    </div>

                                    <div className="checkout-total-row">
                                        <span>Total</span>
                                        <strong>₹{orderTotal}</strong>
                                    </div>
                                    {payment && <p className="checkout-payment-note mb-0">Payment: {payment}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-7 order-lg-1">
                            <form className="checkout-form" onSubmit={handleCheckout}>
                                <div className="card checkout-card">
                                    <div className="card-body p-4">
                                        <h3 className="card-title mb-4">Billing Details</h3>

                                        <div className="row g-3">
                                            <div className="col-12 col-md-6">
                                                <input className="form-control" placeholder="First Name" required onChange={(e) => setfname(e.target.value)} />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <input className="form-control" placeholder="Last Name" required onChange={(e) => setlname(e.target.value)} />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <input className="form-control" placeholder="Phone No." required onChange={(e) => setphn(e.target.value)} />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <input className="form-control" type="email" placeholder="E-Mail" required onChange={(e) => setemail(e.target.value)} />
                                            </div>
                                            <div className="col-12">
                                                <select className="form-select" defaultValue="" required onChange={(e) => setcountry(e.target.value)}>
                                                    <option value="" disabled>Select Country</option>
                                                    <option>India</option>
                                                    <option>Australia</option>
                                                    <option>Canada</option>
                                                    <option>U.S.</option>
                                                    <option>Japan</option>
                                                    <option>China</option>
                                                </select>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <input className="form-control" placeholder="State" required onChange={(e) => setstate(e.target.value)} />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <input className="form-control" placeholder="City" required onChange={(e) => setcity(e.target.value)} />
                                            </div>
                                            <div className="col-12 col-md-5">
                                                <input className="form-control" placeholder="Pin Code" required onChange={(e) => setpostal(e.target.value)} />
                                            </div>
                                            <div className="col-12 col-md-7">
                                                <input className="form-control" placeholder="Address" required onChange={(e) => setaddress(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card checkout-card mt-4">
                                    <div className="card-body p-4">
                                        <h5 className="mb-3">Choose Payment Option</h5>

                                        <div className="accordion checkout-payment-box" id="payment-method-box">
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
                                            <input className="form-check-input" type="checkbox" id="agree" checked={agree} onChange={(e) => setagree(e.target.checked)} />
                                            <label className="form-check-label" htmlFor="agree">
                                                I agree to the <span className="text-primary">terms & conditions</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn btn-primary btn-lg checkout-submit-btn mt-4" type="submit" disabled={saving}>
                                    {saving ? "Placing Order..." : "Checkout"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
