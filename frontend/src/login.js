import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { Context } from "./usecontext"
import { SEO } from "./SEO"
import { API_BASE } from "./apiConfig"

export const Login = () => {
    const [email, setemail] = useState("")
    const [pass, setpass] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const { loginAuth } = useContext(Context)
    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()
        try {
            const result = await fetch(`${API_BASE}/api/login`, {
                method: "post",
                body: JSON.stringify({ email, pass }),
                headers: { "Content-type": "application/json;charset=UTF-8" }
            })
            if (result) {
                const res = await result.json()
                if (res.statuscode === 1) {
                    if (res.data) {
                        localStorage.setItem("user_details", JSON.stringify(res.data));
                    }
                    loginAuth(res.jwtoken)
                    Swal.fire({ icon: "success", title: "Login Successful" })
                    navigate(`/`)
                    setemail("")
                    setpass("")
                } else {
                    Swal.fire({ icon: "error", title: "Login Error", text: res.message || "Check Password and Mail is Correct" })
                }
            }
        } catch (err) {
            console.error("Login request failed:", err)
            Swal.fire({ icon: "error", title: "Connection Error", text: "Unable to connect to server. Please try again." })
        }
    }

    return <main className="account-page">
        <SEO
            title="Sign In"
            robots="noindex, nofollow"
        />
        <section className="account-showcase login-showcase">
            <Link to="/" className="account-back"><i className="bi bi-arrow-left"></i> Back to Elcto</Link>
            <div className="account-showcase-content">
                <span className="vendor-eyebrow"><i className="bi bi-bag-heart"></i> Shop smarter with Elcto</span>
                <h1>Good to see<br />you again.</h1>
                <p>Sign in to pick up where you left off—from saved favorites to order updates.</p>
                <div className="account-showcase-points"><span><i className="bi bi-heart"></i> Saved favorites</span><span><i className="bi bi-truck"></i> Order tracking</span><span><i className="bi bi-stars"></i> Member offers</span></div>
            </div>
        </section>
        <section className="account-panel"><div className="account-card">
            <Link to="/" className="account-mobile-back"><i className="bi bi-arrow-left"></i> Elcto</Link>
            <span className="vendor-eyebrow vendor-eyebrow-dark">Welcome back</span>
            <h2>Sign in to your account.</h2>
            <p className="account-subtitle">Enter your details to continue shopping.</p>
            <form onSubmit={login} className="account-form">
                <label className="vendor-field"><span>Email address</span><input type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setemail(e.target.value)} /></label>
                <label className="vendor-field"><span>Password</span><div className="account-password-input"><input type={showPassword ? "text" : "password"} required autoComplete="current-password" placeholder="Your password" value={pass} onChange={(e) => setpass(e.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}><i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i></button></div></label>
                <div className="account-form-row"><label className="account-check"><input type="checkbox" /> <span>Remember me</span></label><Link to="/forgot">Forgot password?</Link></div>
                <button className="vendor-primary-btn" type="submit">Sign in <i className="bi bi-arrow-right"></i></button>
            </form>
            <p className="account-switch">New to Elcto? <Link to="/register">Create an account</Link></p>
        </div></section>
    </main>
}
