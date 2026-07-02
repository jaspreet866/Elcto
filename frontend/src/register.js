import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export const Register = () => {

    const [fname, setfname] = useState("")
    const [lname, setlname] = useState("")
    const [email, setemail] = useState("")
    const [pass, setpass] = useState("")
    const [msg, setmsg] = useState("")
    const navigate = useNavigate()

    const register = async () => {
        const data = { fname, lname, email, pass }
        const result = await fetch("https://elcto-1.onrender.com/api/register", {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 2) {
                Swal.fire({
                    icon: "info",
                    title: "  👤  Registration",
                    text: (res.message)
                })
            }
            else if (res.statuscode === 1) {
                Swal.fire({
                    icon: "success",
                    title: " 👤 Registration",
                    text: "Registered Successfully , ElectoMart Welcomes You"
                })
                setemail("")
                setfname("")
                setlname("")
                setpass('')
                navigate("/login")
            }
            if (res.statuscode === 3) {
                setmsg(res.message)
            }
           


        }
    }

    return (
        <>
            <section className="s-page-title d-flex align-items-center justify-content-center text-center">
                <div className="container-fluid bread">
                    <div className="content">
                        <h1 className="title-page">Register</h1>

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
                                    Register
                                </h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <div className="container p-5">

                <div className="row align-items-center g-5">


                    <div className="col-lg-6">
                        <h2 className="mb-4">Register 👤 </h2>

                        <div className="mb-3  d-flex gap-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="First Name"
                                onChange={(e) => setfname(e.target.value)}
                            />

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Last Name"
                                onChange={(e) => setlname(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                onChange={(e) => setemail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                onChange={(e) => setpass(e.target.value)}
                            />
                            <p className="text-danger ms-2 text-start">{msg}</p>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={register}
                        >
                            Register
                        </button>
                    </div>


                    <div className="col-lg-6  d-lg-flex align-items-center">
                        <div className="p-4 bg-light rounded shadow-sm w-100 text-center">
                            <h2 className="fw-bold">Create Your Account 🚀</h2>

                            <p className="text-muted mt-3">
                                Register to track orders, save your wishlist,
                                and enjoy a faster checkout.
                            </p>

                            <ul className="list-unstyled mt-4">
                                <li className="mb-2">✔ Easy order tracking</li>
                                <li className="mb-2">✔ Secure payments</li>
                                <li className="mb-2">✔ Exclusive offers</li>
                            </ul>
                            <hr></hr>
                            <div><p className="text-primary">Already Have a Account?<br></br>Get Back to Your Account </p>
                                <button className="btn btn-primary " onClick={() => navigate("/login")}>Login</button></div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}
