import { useState } from "react"
import { Link } from "react-router-dom"
import { SEO } from "./SEO"

export const Vendor = () => {
    const [name, setname] = useState("")
    const [uname, setuname] = useState("")
    const [email, setemail] = useState("")
    const [pass, setpass] = useState("")
    const [bank, setbank] = useState("")
    const [phn, setphn] = useState("")
    const [city, setcity] = useState("")
    const [state, setstate] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState("")

    const register = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setMessage("")
        const data = { name, uname, email, phn, pass, bank, city, state }
        try {
            const result = await fetch("https://elcto-1.onrender.com/api/vendorregister", {
                method: "post",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json;charset=UTF-8" }
            })
            const res = result.ok ? await result.json() : null
            setMessage(res?.statuscode === 1 ? "Application received — we’ll be in touch shortly." : "We couldn’t submit your application. Please try again.")
        } catch {
            setMessage("We couldn’t submit your application. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="vendor-page">
            <SEO
                title="Sell on ElectoMart - Vendor Registration"
                description="Join the ElectoMart Partner Network. Sell your electronics to thousands of tech buyers across India with simple onboarding."
                keywords="sell electronics online, vendor registration, ElectoMart partner network, tech sellers"
            />
            <section className="vendor-hero">
                <div className="vendor-shell vendor-hero-content">
                    <span className="vendor-eyebrow"><i className="bi bi-shop-window"></i> Elcto Partner Network</span>
                    <h1>Build your business with a storefront that works for you.</h1>
                    <p>Reach more customers, manage products simply, and grow with confidence.</p>
                    <div className="vendor-trust-row">
                        <span><i className="bi bi-check2-circle"></i> Simple onboarding</span>
                        <span><i className="bi bi-shield-check"></i> Secure payments</span>
                        <span><i className="bi bi-graph-up-arrow"></i> Built to grow</span>
                    </div>
                </div>
            </section>

            <section className="vendor-shell vendor-application-wrap">
                <aside className="vendor-benefits-panel">
                    <div className="vendor-benefit-icon"><i className="bi bi-rocket-takeoff"></i></div>
                    <span className="vendor-eyebrow vendor-eyebrow-dark">Your next channel</span>
                    <h2>More visibility. More possibility.</h2>
                    <p>Join a marketplace made for modern electronics brands and independent sellers.</p>
                    <div className="vendor-stat-grid">
                        <div><strong>01</strong><span>Quick review</span></div>
                        <div><strong>02</strong><span>Set up your catalog</span></div>
                        <div><strong>03</strong><span>Start selling</span></div>
                    </div>
                    <div className="vendor-login-prompt">Already approved?<Link to="/vlogin">Sign in to your portal <i className="bi bi-arrow-right"></i></Link></div>
                </aside>

                <form className="vendor-form-card" onSubmit={register}>
                    <div className="vendor-form-heading">
                        <span>Partner application</span>
                        <h2>Tell us about your business.</h2>
                        <p>Complete the details below to begin your vendor application.</p>
                    </div>
                    <div className="vendor-fields">
                        <label className="vendor-field"><span>Full name</span><input type="text" required placeholder="Your name" value={name} onChange={(e) => setname(e.target.value)} /></label>
                        <label className="vendor-field"><span>Username</span><input type="text" required placeholder="Choose a username" value={uname} onChange={(e) => setuname(e.target.value)} /></label>
                        <label className="vendor-field vendor-field-wide"><span>Business email</span><input type="email" required placeholder="you@business.com" value={email} onChange={(e) => setemail(e.target.value)} /></label>
                        <label className="vendor-field vendor-field-wide"><span>Password</span><input type="password" required placeholder="Create a secure password" value={pass} onChange={(e) => setpass(e.target.value)} /></label>
                        <label className="vendor-field"><span>Bank name</span><input type="text" required placeholder="Your bank" value={bank} onChange={(e) => setbank(e.target.value)} /></label>
                        <label className="vendor-field"><span>Phone number</span><input type="tel" required placeholder="Your phone number" value={phn} onChange={(e) => setphn(e.target.value)} /></label>
                        <label className="vendor-field"><span>City</span><input type="text" required placeholder="Your city" value={city} onChange={(e) => setcity(e.target.value)} /></label>
                        <label className="vendor-field"><span>State</span><input type="text" required placeholder="Your state" value={state} onChange={(e) => setstate(e.target.value)} /></label>
                    </div>
                    {message && <p className="vendor-form-message" role="status">{message}</p>}
                    <button type="submit" className="vendor-primary-btn" disabled={submitting}>{submitting ? "Sending application…" : <>Submit application <i className="bi bi-arrow-right"></i></>}</button>
                    <p className="vendor-form-note"><i className="bi bi-lock"></i> Your information is handled securely.</p>
                </form>
            </section>
        </main>
    )
}
