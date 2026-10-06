import { useCallback, useEffect, useMemo, useState, useContext } from "react"
import Swal from "sweetalert2"
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom"
import { Context } from "./usecontext"
import { API_BASE } from "./apiConfig"
import { SEO } from "./SEO"
import { inr } from "./format"
import "./Shop.css"

const paymentOptions = [
    { value: "Credit Card", label: "Credit Card", icon: "bi-credit-card", note: "Pay with your card details." },
    { value: "Cash on Delivery", label: "Cash On Delivery", icon: "bi-cash-coin", note: "Pay when your order is delivered." },
    { value: "Online via Paypal", label: "PayPal", icon: "bi-paypal", note: "You will be redirected to PayPal to complete your payment." }
]

export const Check = () => {
    const { id: contextId, mail: contextMail, fetchCart } = useContext(Context)
    const [fname, setfname] = useState("")
    const [lname, setlname] = useState("")
    const [phn, setphn] = useState()
    const [email, setemail] = useState(contextMail || "")
    const [country, setcountry] = useState("")
    const [state, setstate] = useState("")
    const [city, setcity] = useState("")
    const [postal, setpostal] = useState()
    const [address, setaddress] = useState("")
    const [d, setd] = useState([])
    const location = useLocation()
    const navigate = useNavigate()
    const orderno = Math.floor(Math.random() * 1000)
    const [payment, setpayment] = useState("")
    const [agree, setagree] = useState(false)
    const [saving, setsaving] = useState(false)
    const { totalprice } = location.state || {};
    const [idd] = useSearchParams()
    const id = idd.get("id") || contextId;
    const orderTotal = useMemo(() => {
        return totalprice || d.reduce((acc, item) => acc + (item.Quantity * item.Price), 0)
    }, [d, totalprice])

    const show = useCallback(async () => {
        if (!id) return;
        try {
            const result = await fetch(`${API_BASE}/api/getcartdata/${id}`, {
                method: "get"
            })
            if (result.ok) {
                const res = await result.json()
                if (res.statuscode === 1 && Array.isArray(res.data)) {
                    setd(res.data)
                }
            }
        } catch (err) {
            console.error("Failed to load checkout cart data:", err);
        }
    }, [id])

    useEffect(() => {
        if (id) {
            show()
        }
    }, [id, show])

    useEffect(() => {
        if (!email && contextMail) {
            setemail(contextMail);
        }
    }, [contextMail, email]);

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
                if (fetchCart) fetchCart();
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
        await save()
        setsaving(false)
    }


    return (
        <>
            <SEO
                title="Secure Checkout"
                robots="noindex, nofollow"
            />
            <section className="s-page-title d-flex align-items-center justify-content-center text-center">
                <div className="container-fluid bread">
                    <div className="content">
                        <h1 className="title-page">Checkout</h1>

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
                                    Checkout
                                </h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="shop-page">
                <div className="container">
                    <div className="shop-layout shop-layout-summary-first">
                        <form className="shop-stack" onSubmit={handleCheckout}>
                            <div className="shop-panel">
                                <div className="shop-panel-head">
                                    <div className="shop-panel-heading">
                                        <div className="shop-step">1</div>
                                        <h2 className="shop-panel-title">Contact Details</h2>
                                    </div>
                                </div>
                                <div className="shop-panel-body">
                                    <div className="shop-fields">
                                        <div className="shop-field">
                                            <label htmlFor="checkout-fname">First Name</label>
                                            <input id="checkout-fname" className="form-control" autoComplete="given-name" required onChange={(e) => setfname(e.target.value)} />
                                        </div>
                                        <div className="shop-field">
                                            <label htmlFor="checkout-lname">Last Name</label>
                                            <input id="checkout-lname" className="form-control" autoComplete="family-name" required onChange={(e) => setlname(e.target.value)} />
                                        </div>
                                        <div className="shop-field">
                                            <label htmlFor="checkout-phone">Phone No.</label>
                                            <input id="checkout-phone" className="form-control" type="tel" inputMode="tel" autoComplete="tel" required onChange={(e) => setphn(e.target.value)} />
                                        </div>
                                        <div className="shop-field">
                                            <label htmlFor="checkout-email">E-Mail</label>
                                            <input id="checkout-email" className="form-control" type="email" autoComplete="email" required value={email} onChange={(e) => setemail(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="shop-panel">
                                <div className="shop-panel-head">
                                    <div className="shop-panel-heading">
                                        <div className="shop-step">2</div>
                                        <h2 className="shop-panel-title">Billing Address</h2>
                                    </div>
                                </div>
                                <div className="shop-panel-body">
                                    <div className="shop-fields">
                                        <div className="shop-field shop-field-wide">
                                            <label htmlFor="checkout-address">Address</label>
                                            <input id="checkout-address" className="form-control" autoComplete="street-address" required onChange={(e) => setaddress(e.target.value)} />
                                        </div>
                                        <div className="shop-field">
                                            <label htmlFor="checkout-city">City</label>
                                            <input id="checkout-city" className="form-control" autoComplete="address-level2" required onChange={(e) => setcity(e.target.value)} />
                                        </div>
                                        <div className="shop-field">
                                            <label htmlFor="checkout-state">State</label>
                                            <input id="checkout-state" className="form-control" autoComplete="address-level1" required onChange={(e) => setstate(e.target.value)} />
                                        </div>
                                        <div className="shop-field">
                                            <label htmlFor="checkout-postal">Pin Code</label>
                                            <input id="checkout-postal" className="form-control" inputMode="numeric" autoComplete="postal-code" required onChange={(e) => setpostal(e.target.value)} />
                                        </div>
                                        <div className="shop-field">
                                            <label htmlFor="checkout-country">Country</label>
                                            <select id="checkout-country" className="form-select" defaultValue="" autoComplete="country-name" required onChange={(e) => setcountry(e.target.value)}>
                                                <option value="" disabled>Select Country</option>
                                                <option>India</option>
                                                <option>Australia</option>
                                                <option>Canada</option>
                                                <option>U.S.</option>
                                                <option>Japan</option>
                                                <option>China</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="shop-panel">
                                <div className="shop-panel-head">
                                    <div className="shop-panel-heading">
                                        <div className="shop-step">3</div>
                                        <h2 className="shop-panel-title">Choose Payment Option</h2>
                                    </div>
                                </div>
                                <div className="shop-panel-body">
                                    <div className="pay-options" role="radiogroup" aria-label="Payment option">
                                        {paymentOptions.map((option) => (
                                            <label key={option.value} className={`pay-option ${payment === option.value ? "is-selected" : ""}`}>
                                                <input type="radio" name="payment" className="form-check-input" checked={payment === option.value} onChange={() => setpayment(option.value)} />
                                                <div className="pay-option-icon">
                                                    <i className={`bi ${option.icon}`}></i>
                                                </div>
                                                <div className="pay-option-text">
                                                    <strong>{option.label}</strong>
                                                    <small>{option.note}</small>
                                                </div>
                                            </label>
                                        ))}

                                        <div className="pay-card-fields" hidden={payment !== "Credit Card"}>
                                            <div className="shop-fields">
                                                <div className="shop-field shop-field-wide">
                                                    <label htmlFor="checkout-card-name">Name on card</label>
                                                    <input id="checkout-card-name" className="form-control" autoComplete="cc-name" />
                                                </div>
                                                <div className="shop-field shop-field-wide">
                                                    <label htmlFor="checkout-card-number">Card number</label>
                                                    <input id="checkout-card-number" className="form-control" inputMode="numeric" autoComplete="cc-number" />
                                                </div>
                                                <div className="shop-field">
                                                    <label htmlFor="checkout-card-expiry">Expiry</label>
                                                    <input id="checkout-card-expiry" type="month" className="form-control" autoComplete="cc-exp" />
                                                </div>
                                                <div className="shop-field">
                                                    <label htmlFor="checkout-card-postal">Postal code</label>
                                                    <input id="checkout-card-postal" className="form-control" autoComplete="postal-code" />
                                                </div>
                                            </div>
                                            <div className="form-check mt-3">
                                                <input className="form-check-input" type="checkbox" id="saveCard" />
                                                <label className="form-check-label" htmlFor="saveCard">
                                                    Save card details
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shop-consent">
                                        <div className="shop-consent-note">
                                            Your personal data will be used to process your order and support your
                                            experience on this website.
                                        </div>

                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="agree" checked={agree} onChange={(e) => setagree(e.target.checked)} />
                                            <label className="form-check-label" htmlFor="agree">
                                                I agree to the <strong className="text-primary">terms & conditions</strong>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="shop-submit-row">
                                <button className="btn btn-primary btn-lg shop-btn" type="submit" disabled={saving}>
                                    {saving ? "Placing Order..." : <>Place Order · {inr(orderTotal)}</>}
                                </button>
                            </div>
                        </form>

                        <aside className="shop-panel shop-summary">
                            <div className="shop-panel-head">
                                <h2 className="shop-panel-title">Your Order Details</h2>
                                <small className="shop-panel-meta">{d.length} {d.length === 1 ? "product" : "products"}</small>
                            </div>
                            <div className="shop-panel-body">
                                <ul className="shop-lines">
                                    {d.map((a) => (
                                        <li className="shop-line" key={a._id}>
                                            <img
                                                src={`${a.Img}`}
                                                alt={a.Name}
                                                className="shop-thumb"
                                            />
                                            <div>
                                                <div className="shop-line-name">{a.Name}</div>
                                                <small className="shop-line-meta">Qty: {a.Quantity}</small>
                                            </div>
                                            <div className="shop-line-price">{inr(a.Price * a.Quantity)}</div>
                                        </li>
                                    ))}
                                </ul>

                                <dl className="shop-summary-rows">
                                    <div className="shop-summary-row shop-summary-total">
                                        <dt>Total</dt>
                                        <dd>{inr(orderTotal)}</dd>
                                    </div>
                                </dl>
                                {payment && (
                                    <div className="shop-summary-note">
                                        <i className="bi bi-wallet2"></i> Payment: {payment}
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    )
}
