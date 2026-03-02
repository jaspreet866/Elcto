import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { Context } from "./usecontext"

export const Login = () => {

    const [email, setemail] = useState()
    const [pass, setpass] = useState()
    const { setid } = useContext(Context)
    const { setutype } = useContext(Context)
    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()
        const data = { email, pass }
        const result = await fetch("https://elcto-1.onrender.com/api/login", {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                localStorage.setItem("data", JSON.stringify(res.jwtoken))
                Swal.fire({
                    icon: "success",
                    title: "Login SuccessFully",

                })
                setutype(res.data.usertype)
                setid(res.data.id)
                navigate(`/`)
                setemail("")
                setpass()
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Login Error",
                    text: "Check Password and Mail is Correct"
                })
            }
        }
    }

    return (
        <>
            <section className="s-page-title d-flex align-items-center justify-content-center text-center">
                <div className="container-fluid bread">
                    <div className="content">
                        <h1 className="title-page">Login</h1>

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
                                    Login
                                </h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="login-section">
                <div className="container p-5">
                    <div className="row align-items-center gy-5 ">


                        <div className="col-lg-6 col-12">
                            <h1>LOGIN</h1>

                            <form>
                                <input
                                    className="form-control mt-4"
                                    type="email"
                                    placeholder="Enter E-mail"
                                    onChange={(e) => setemail(e.target.value)}
                                />

                                <input
                                    className="form-control mt-3"
                                    type="password"
                                    placeholder="Enter Password"
                                    onChange={(e) => setpass(e.target.value)}
                                />


                                <div className="form-check mt-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        onClick={(e) => {
                                            const input = e.target.closest("form").querySelector('input[type="password"]')
                                            input.type = input.type === "password" ? "text" : "password"
                                        }}
                                    />
                                    <label className="form-check-label">
                                        Show Password
                                    </label>
                                </div>


                                <div className="d-flex justify-content-between align-content-center align-items-center">
                                    <button
                                        className="btn btn-primary mt-3 w-25 "
                                        onClick={login}
                                    >
                                        Login
                                    </button>


                                    <p className="mt-3 text-center">
                                        <a href="/forgot-password" className="text-decoration-none">
                                            Forgot password?
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </div>


                        <div className="col-lg-6 col-12 d-lg-flex align-items-center ">
                            <div className="p-4 bg-light rounded shadow-sm w-100 text-center">
                                <h2 className="fw-bold">Welcome Back 👋</h2>

                                <p className="text-muted mt-3">
                                    Login to manage your account, track orders,
                                    and enjoy a faster checkout experience.
                                </p>

                                <ul className="list-unstyled mt-4">
                                    <li className="mb-2">✔ Track your orders</li>
                                    <li className="mb-2">✔ Manage your profile</li>
                                    <li className="mb-2">✔ Exclusive offers</li>
                                </ul>

                                <hr />

                                <p className="mb-2 text-primary">Don’t have an account?</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate("/register")}
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}
