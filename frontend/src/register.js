import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { SEO } from "./SEO"

export const Register = () => {
    const [fname, setfname] = useState("")
    const [lname, setlname] = useState("")
    const [email, setemail] = useState("")
    const [pass, setpass] = useState("")
    const [msg, setmsg] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const register = async (e) => {
        e.preventDefault()
        const result = await fetch("https://elcto-1.onrender.com/api/register", { method: "post", body: JSON.stringify({ fname, lname, email, pass }), headers: { "Content-type": "application/json;charset=UTF-8" } })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 2) Swal.fire({ icon: "info", title: "Registration", text: res.message })
            else if (res.statuscode === 1) {
                Swal.fire({ icon: "success", title: "Registration", text: "Registered Successfully , ElectoMart Welcomes You" })
                setemail(""); setfname(""); setlname(""); setpass(""); navigate("/login")
            }
            if (res.statuscode === 3) setmsg(res.message)
        }
    }

    return <main className="account-page account-register-page">
        <SEO
            title="Create Account"
            robots="noindex, nofollow"
        />
        <section className="account-showcase register-showcase">
            <Link to="/" className="account-back"><i className="bi bi-arrow-left"></i> Back to Elcto</Link>
            <div className="account-showcase-content">
                <span className="vendor-eyebrow"><i className="bi bi-sparkles"></i> Your Elcto account</span>
                <h1>Make every<br />find yours.</h1>
                <p>Create an account to make checkout smoother and keep the products you love close.</p>
                <div className="account-member-card"><div><i className="bi bi-person-check"></i></div><span><strong>One account, every order.</strong><small>Favorites, tracking and offers in one place.</small></span></div>
            </div>
        </section>
        <section className="account-panel"><div className="account-card">
            <Link to="/" className="account-mobile-back"><i className="bi bi-arrow-left"></i> Elcto</Link>
            <span className="vendor-eyebrow vendor-eyebrow-dark">Join Elcto</span>
            <h2>Create your account.</h2>
            <p className="account-subtitle">It only takes a moment to get started.</p>
            <form onSubmit={register} className="account-form">
                <div className="account-name-row"><label className="vendor-field"><span>First name</span><input type="text" required autoComplete="given-name" placeholder="First name" value={fname} onChange={(e) => setfname(e.target.value)} /></label><label className="vendor-field"><span>Last name</span><input type="text" required autoComplete="family-name" placeholder="Last name" value={lname} onChange={(e) => setlname(e.target.value)} /></label></div>
                <label className="vendor-field"><span>Email address</span><input type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setemail(e.target.value)} /></label>
                <label className="vendor-field"><span>Password</span><div className="account-password-input"><input type={showPassword ? "text" : "password"} required autoComplete="new-password" placeholder="Create a password" value={pass} onChange={(e) => setpass(e.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}><i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i></button></div></label>
                {msg && <p className="account-error" role="alert">{msg}</p>}
                <button className="vendor-primary-btn" type="submit">Create account <i className="bi bi-arrow-right"></i></button>
            </form>
            <p className="account-terms">By creating an account, you agree to receive essential account updates.</p>
            <p className="account-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div></section>
    </main>
}
