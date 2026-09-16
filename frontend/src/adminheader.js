import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react";
import { Context } from "./usecontext";
import Swal from "sweetalert2"
import logo from "./images/WhatsApp Image 2026-02-12 at 11.08.16 AM.png"
import ThemeToggle from "./ThemeToggle"


export const AdminHeader = () => {
    const { id, logoutAuth } = useContext(Context)
    const flag = Boolean(id || localStorage.getItem("data"));
    const navigate = useNavigate()

    const logout = () => {
        if (logoutAuth) {
            logoutAuth();
        } else {
            localStorage.removeItem("data");
        }
        Swal.fire({
            title: 'Logged Out',
            text: 'You have been logged out successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        navigate("/");
    }
    return (
        <>

            <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top" id="navbar">
                <div className="container">


                    <Link to="/" className="navbar-brand fw-bold fs-4">
                        <img src={logo} alt="logo" className="navbar-logo" />

                    </Link>


                    <button
                        className="navbar-toggler border-0 shadow-none bg-transparent"
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
                                    Dashboard
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


                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Account
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2 text-start" style={{ minWidth: "180px" }}>
                                    {flag ? (
                                        <>
                                            <li>
                                                <Link className="dropdown-item rounded-3 py-2 fw-semibold" to="/profile">
                                                    <i className="bi bi-person-circle me-2 text-primary"></i>My Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item rounded-3 py-2 fw-semibold" to="/dashboard">
                                                    <i className="bi bi-speedometer2 me-2 text-info"></i>Dashboard
                                                </Link>
                                            </li>
                                            <li><hr className="dropdown-divider my-1" /></li>
                                            <li>
                                                <button onClick={logout} className="dropdown-item rounded-3 py-2 text-danger fw-semibold w-100 text-start border-0 bg-transparent">
                                                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                                                </button>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li><Link className="dropdown-item text-center rounded-3 mb-1" to="/login">Log In</Link></li>
                                            <li><Link className="dropdown-item text-center rounded-3 fw-semibold text-primary" to="/register">Sign Up</Link></li>
                                        </>
                                    )}
                                </ul>
                            </li>
                            <li className="nav-item d-flex align-items-center ms-lg-2">
                                <ThemeToggle />
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
