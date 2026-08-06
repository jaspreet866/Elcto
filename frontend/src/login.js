import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { Context } from "./usecontext"

export const Login = () => {
    const [email, setemail] = useState("")
    const [pass, setpass] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const { setid, setutype } = useContext(Context)
    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()
        const result = await fetch("https://elcto-1.onrender.com/api/login", { method: "post", body: JSON.stringify({ email, pass }), headers: { "Content-type": "application/json;charset=UTF-8" } })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                localStorage.setItem("data", JSON.stringify(res.jwtoken))
                Swal.fire({ icon: "success", title: "Login SuccessFully" })
                setutype(res.data.usertype); setid(res.data.id); navigate(`/`); setemail(""); setpass("")
            } else Swal.fire({ icon: "error", title: "Login Error", text: "Check Password and Mail is Correct" })
        }
    }

    return <main className="account-page">
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
