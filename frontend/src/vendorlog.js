import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export const VendorLogin = () => {
    const [email, setemail] = useState("")
    const [pass, setpass] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")
        try {
            const result = await fetch("https://elcto-1.onrender.com/api/vlog", {
                method: "post", body: JSON.stringify({ email, pass }), headers: { "Content-type": "application/json;charset=UTF-8" }
            })
            const res = result.ok ? await result.json() : null
            if (res?.statuscode === 1) {
                localStorage.setItem("data", JSON.stringify(res.token))
                navigate("/")
            } else setMessage("Email or password isn’t correct. Please try again.")
        } catch { setMessage("We couldn’t sign you in right now. Please try again.") } finally { setLoading(false) }
    }

    return (
        <main className="vendor-login-page">
            <section className="vendor-login-visual">
                <Link to="/" className="vendor-back-link"><i className="bi bi-arrow-left"></i> Back to Elcto</Link>
                <div className="vendor-login-visual-content">
                    <span className="vendor-eyebrow"><i className="bi bi-shop-window"></i> Elcto Seller Portal</span>
                    <h1>Your store,<br />in one place.</h1>
                    <p>Manage your catalog and keep building the business your customers love.</p>
                    <div className="vendor-quote"><i className="bi bi-quote"></i><span>“Simple tools, focused selling.”</span></div>
                </div>
            </section>
            <section className="vendor-login-panel">
                <div className="vendor-login-card">
                    <Link to="/" className="vendor-mobile-back"><i className="bi bi-arrow-left"></i> Elcto</Link>
                    <span className="vendor-eyebrow vendor-eyebrow-dark">Welcome back</span>
                    <h2>Sign in to your portal.</h2>
                    <p className="vendor-login-subtitle">Enter your details to access your products.</p>
                    <form onSubmit={login} className="vendor-login-form">
                        <label className="vendor-field"><span>Email address</span><input type="email" required autoComplete="email" placeholder="you@business.com" value={email} onChange={(e) => setemail(e.target.value)} /></label>
                        <label className="vendor-field"><span>Password</span><input type="password" required autoComplete="current-password" placeholder="Your password" value={pass} onChange={(e) => setpass(e.target.value)} /></label>
                        {message && <p className="vendor-form-message" role="alert">{message}</p>}
                        <button className="vendor-primary-btn" type="submit" disabled={loading}>{loading ? "Signing in…" : <>Sign in <i className="bi bi-arrow-right"></i></>}</button>
                    </form>
                    <p className="vendor-new-account">New to selling on Elcto? <Link to="/vendor">Apply to become a vendor</Link></p>
                </div>
            </section>
        </main>
    )
}
