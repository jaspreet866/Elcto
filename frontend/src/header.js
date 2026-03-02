import { Link, useNavigate } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { Context } from "./usecontext";
import logo from "./images/WhatsApp Image 2026-02-12 at 11.08.16 AM.png"

export const Header = () => {
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


            <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
                <div className="container">
                    <div className="d-flex gap-4">
                        <button
                            className="navbar-toggler d-lg-none"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#mobileOffcanvas"
                            aria-controls="mobileOffcanvas"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <Link to="/" className="navbar-brand fw-bold fs-4">
                            <img src={logo} alt="logo" style={{ height: "40px" }} className="navbar-logo" />

                        </Link>

                    </div>



                    <div className="collapse navbar-collapse d-none d-lg-block" id="navbarSupportedContent">


                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-2">

                            <li className="nav-item">
                                <a className="nav-link active fw-semibold" href="#">
                                    Home
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    About
                                </a>
                            </li>


                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" >
                                    Products
                                </a>
                                <ul className="dropdown-menu shadow-sm">
                                    <Link className="text-decoration-none" to={`/related?id=6970dd16300a757a6dcdb928`}><li><a className="dropdown-item">LED</a></li></Link>
                                    <Link className="text-decoration-none" to={`/related?id=6970dd60300a757a6dcdb92e`}><li><a className="dropdown-item">Laptops</a></li></Link>
                                    <Link className="text-decoration-none" to={`/related?id=6970dd2d300a757a6dcdb92a`}><li><a className="dropdown-item">Mobiles</a></li></Link>
                                    <Link className="text-decoration-none" to={`/related?id=69849f299a77c6ecd3c2839b`}><li><a className="dropdown-item">Airpods</a></li></Link>
                                    <Link className="text-decoration-none" to={`/related?id=69849fa89a77c6ecd3c283af`}><li><a className="dropdown-item">Cameras</a></li></Link>
                                </ul>
                            </li>


                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Features
                                </a>
                                <ul className="dropdown-menu shadow-sm">
                                    <li><a className="dropdown-item">About Us</a></li>
                                    <li><a className="dropdown-item">Contact Us</a></li>
                                    <li><a className="dropdown-item">Order</a></li>
                                </ul>
                            </li>

                            {/* ACCOUNT */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Account
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                                    <li>
                                        {flag ? <>
                                            <p onClick={logout} className=" text-center dropdown-item justify-content-center align-content-center">
                                                Logout
                                            </p></>
                                            : <>
                                                <Link className=" text-decoration-none text-black text-center ms-4" to="/login">Log IN</Link><br></br>
                                                <Link className="text-decoration-none text-black text-center ms-4" to="/register">SignUp</Link>
                                            </>}
                                    </li>
                                </ul>
                            </li>
                        </ul>

                        <div className="ms-5 d-flex ">
                            <button className="fs-4 btn" onClick={() => navigate("/cart")} ><i className="bi bi-cart-fill"></i></button>
                            <div className="fs-4 btn"><i className="bi bi-person-fill" onClick={() => navigate("/login")}></i></div>
                            <div className="fs-4 btn"><i className="bi bi-heart-fill" onClick={() => navigate("/wish")}></i></div>
                        </div>

                    </div>
                </div>
            </nav>




            {/* moblie */}
            <div className="offcanvas offcanvas-start d-lg-none" tabIndex="-1" id="mobileOffcanvas" aria-labelledby="mobileOffcanvasLabel">
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title fw-bold" id="mobileOffcanvasLabel">ElectoMart</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active fw-semibold py-3 text-start " >
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/about" className="nav-link text-start ">
                                About
                            </Link>
                        </li>


                        <li className="nav-item">
                            <a
                                className="nav-link py-3  d-flex justify-content-between align-items-center"
                                data-bs-toggle="collapse"
                                href="#productsCollapse"
                                role="button"
                                aria-expanded="false"
                                aria-controls="productsCollapse"
                            >
                                <span>
                                    Products
                                </span>
                                <i className="bi bi-chevron-down"></i>
                            </a>
                            <div className="collapse text-start" id="productsCollapse">
                                <div className="ps-4 py-2">
                                    <a className="dropdown-item py-2" >LEDs</a>
                                    <a className="dropdown-item py-2" >Laptops</a>
                                    <a className="dropdown-item py-2" >Mobiles</a>
                                </div>
                            </div>
                        </li>


                        <li className="nav-item">
                            <a
                                className="nav-link py-3  d-flex justify-content-between align-items-center"
                                data-bs-toggle="collapse"
                                href="#featuresCollapse"
                                role="button"
                                aria-expanded="false"
                                aria-controls="featuresCollapse"
                            >
                                <span>
                                    Features
                                </span>
                                <i className="bi bi-chevron-down"></i>
                            </a>
                            <div className="collapse text-start" id="featuresCollapse">
                                <div className="ps-4 py-2">
                                    <Link to="/about" className="dropdown-item py-2" >About Us</Link>
                                    <Link className="dropdown-item py-2" >Contact Us</Link>
                                    <Link to="/myorder" className="dropdown-item py-2" >Order</Link>
                                </div>
                            </div>
                        </li>


                        <li className="nav-item">
                            <a
                                className="nav-link py-3  d-flex justify-content-between align-items-center"
                                data-bs-toggle="collapse"
                                href="#accountCollapse"
                                role="button"
                                aria-expanded="false"
                                aria-controls="accountCollapse"
                            >
                                <span>
                                    Account
                                </span>
                                <i className="bi bi-chevron-down"></i>
                            </a>
                            <div className="collapse text-start" id="accountCollapse">
                                <div className="ps-4 py-2">
                                    <Link to="/login" className="dropdown-item py-2">Login</Link>
                                    <Link to="/register" className="dropdown-item py-2" >Sign Up</Link>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div className="mt-4 pt-3 border-top">
                        <h6 className="fw-bold mb-3">Contact Info</h6>
                        <div className="mb-2">
                            <i className="bi bi-telephone me-2"></i>
                            <span>Contact Us: </span>
                            <strong>59434596</strong>
                        </div>
                        <div className="mb-2">
                            <i className="bi bi-envelope me-2"></i>
                            <span>E-Mail: </span>
                            <strong>electromart@gmail.com</strong>
                        </div>
                        <div className="mb-2">
                            <i className="bi bi-clock me-2"></i>
                            <span>Hours: </span>
                            <strong>9:00 AM - 8:00 PM</strong>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="bottom-toolbar ">
                    <div className="btn text-white" onClick={() => { navigate("/") }}>
                        <i className="bi bi-house-fill"></i><br></br>
                        <span className=''>Home</span>
                    </div>
                    <div className="btn text-white" onClick={() => { navigate("/myorder") }}>
                        <i className="bi bi-bag-fill" ></i><br></br>
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