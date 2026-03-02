import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react";
import { Context } from "./usecontext";
import logo from "./images/WhatsApp Image 2026-02-12 at 11.08.16 AM.png"


export const AdminHeader = () => {
    const [flag, setflag] = useState(false);
    const { id, setid } = useContext(Context)
    const { setutype } = useContext(Context)
    const navigate = useNavigate()


    useEffect(() => {

        const token = localStorage.getItem("data")
        if (token) {
            setflag(true);

        }
        else {
            setflag(false);
        }
    }, [id])


    const logout = () => {
        localStorage.removeItem("data");
        setflag(false);
        setid("");
        alert("logged out");
        setutype("User")
    }
    return (
        <>

            <nav className="navbar navbar-expand-lg  shadow-sm sticky-top" id="navbar">
                <div className="container">


                    <Link to="/" className="navbar-brand fw-bold fs-4">
                        <img src={logo} alt="logo" className="navbar-logo" />

                    </Link>


                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#adminNavbar"
                        aria-controls="adminNavbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>


                    <div className="collapse navbar-collapse" id="adminNavbar">


                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-2">

                            <li className="nav-item">
                                <Link className="nav-link fw-semibold" to="/dashboard">
                                    Home
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/product">
                                    Add Product
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/category">
                                    Add Category
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/response">
                                    Response
                                </Link>
                            </li>


                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Account
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow-sm text-center ">
                                    <li>
                                        {flag ? <>
                                            <button onClick={logout} className="btn text-center justify-content-center">
                                                Logout
                                            </button></>
                                            : <>
                                                <Link className=" text-decoration-none text-black" to="/login">Log IN</Link><br></br>
                                                <Link className="text-decoration-none text-black" to="/register">SignUp</Link>
                                            </>}
                                    </li>
                                </ul>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav>
            <div className="container-fluid">
                <div className="bottom-toolbar">
                    <div className="btn text-white" onClick={() => { navigate("/") }}>
                        <i className="bi bi-house-fill"></i><br></br>
                        <span className='active'>Home</span>
                    </div>
                    <div className="btn text-white" onClick={() => { navigate("/myorder") }}>
                        <i className="bi bi-bag-fill"></i><br></br>
                        <span className='' >Order</span>
                    </div>
                    <div className="btn text-white" onClick={() => { navigate("/wish") }}>
                        <i className="bi bi-heart-fill"></i><br></br>
                        <span className=''>Wishlist</span>
                    </div>
                    <div className="btn text-white" onClick={() => { navigate("/cart") }}>
                        <i class="bi bi-cart-fill"></i><br></br>
                        <span className=''>Cart</span>
                    </div>
                    <div className="btn text-white" onClick={logout}>
                        <i className="bi bi-person-fill"></i><br></br>
                        <span className=''>{flag ? "LogOut" : "Login"}</span>
                    </div>

                </div>

            </div>
        </>
    )
}
