import { Link, useNavigate } from "react-router-dom"
import { useContext, useState, useEffect ,useRef} from "react"
import Swal from "sweetalert2";
import { Context } from "./usecontext";
import logo from "./images/WhatsApp Image 2026-02-12 at 11.08.16 AM.png"
import { motion, AnimatePresence } from 'framer-motion'

export const Header = () => {
    const [flag, setflag] = useState(false);
    const { id, setid, theme, toggleTheme } = useContext(Context)
    const { setutype } = useContext(Context)
     const[d,setd]=useState([])
    const searchRef = useRef(null);
    const [search,setsearch] = useState("")
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

     useEffect(()=>{
        handleSearch();
    },[search])

    const handleSearch = async () => {
        const result = await fetch(`https://elcto-1.onrender.com/api/getproduct`, {
            method: "get"
        })
        if (result.ok) {
            const res= await result.json();
            if(res.statuscode===1){
                setd(res.data);
               
            }
        }
         if(searchRef.current){
            clearTimeout(searchRef.current);
        }
        searchRef.current = setTimeout(() => {
            setsearch("");
        }, 5000);
    }
    const filteredProducts = [...d].filter((product) =>
    product.ProductName.toLowerCase().includes(search.toLowerCase())
  );


    const logout = () => {
        localStorage.removeItem("data");
        setflag(false);
        setid("");
        Swal.fire("Logout Successfull", "", "success");
       
    }

    const cart=()=>{
        if(id){
            navigate("/cart")
        }
        else{
            navigate("/login")
        }
    }
    const wish=()=>{
        if(id){
            navigate("/wish")
        }
        else{
            navigate("/login")
        }
    }
    return (
        <>


            <nav className="navbar navbar-expand-lg sticky-glass-nav py-2">
                <div className="container">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="navbar-toggler d-lg-none border-0 shadow-none"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#mobileOffcanvas"
                            aria-controls="mobileOffcanvas"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <Link to="/" className="navbar-brand fw-bold fs-4">
                            <motion.img 
                                src={logo} 
                                alt="logo" 
                                style={{ height: "42px" }} 
                                className="navbar-logo" 
                                whileHover={{ scale: 1.06, rotate: 1 }}
                                whileTap={{ scale: 0.95 }}
                            />
                        </Link>
                    </div>

                    <div className="search-box d-none d-lg-block search-input-wrapper flex-grow-1 max-w-md mx-4" style={{ maxWidth: "380px" }}>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0 rounded-start-pill ps-3 text-muted">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                className="form-control bg-light border-0 rounded-end-pill py-2 shadow-none"
                                type="text"
                                value={search}
                                placeholder="Search products, brands..."
                                onChange={(e) => { setsearch(e.target.value) }}
                            />
                        </div>
                        {search.trim().length > 0 && (
                            <div className="live-search-dropdown shadow-lg">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.slice(0, 6).map((a) => {
                                        const rawImg = a.Img || a.ProductImage || a.pic;
                                        const imgSrc = rawImg
                                            ? (rawImg.startsWith('http') || rawImg.startsWith('/') || rawImg.startsWith('data:'))
                                                ? rawImg
                                                : `/uploads/${rawImg}`
                                            : null;
                                        
                                        return (
                                            <Link
                                                key={a._id}
                                                to={`/detail?id=${a._id}&cid=${a.Category}`}
                                                className="search-item-row"
                                                onClick={() => setsearch("")}
                                            >
                                                {imgSrc ? (
                                                    <img
                                                        src={imgSrc}
                                                        alt={a.ProductName}
                                                        className="search-item-thumb"
                                                    />
                                                ) : (
                                                    <div className="search-item-thumb d-flex align-items-center justify-content-center bg-light text-muted">
                                                        <i className="bi bi-image"></i>
                                                    </div>
                                                )}
                                                <div className="search-item-info">
                                                    <p className="search-item-name">{a.ProductName}</p>
                                                   
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="p-3 text-center text-muted small">
                                        <i className="bi bi-search me-1"></i> No matching products found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="collapse navbar-collapse d-none d-lg-block" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-1 align-items-center">
                            <li className="nav-item">
                               <Link to="/" className="nav-link active fw-semibold">
                                    Home
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/about" className="nav-link">
                                    About
                                </Link>
                            </li>

                             <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Products
                                </Link>
                                <ul className="dropdown-menu shadow-lg border-0 rounded-4 p-2">
                                    <Link className="text-decoration-none" to={`/related?id=6970dd16300a757a6dcdb928`}><li><span className="dropdown-item rounded-3">LED TVs</span></li></Link>
                                    <Link className="text-decoration-none" to={`/related?id=6970dd60300a757a6dcdb92e`}><li><span className="dropdown-item rounded-3">Laptops</span></li></Link>
                                    <Link className="text-decoration-none" to={`/related?id=6970dd2d300a757a6dcdb92a`}><li><span className="dropdown-item rounded-3">Mobiles</span></li></Link>
                                    <Link className="text-decoration-none" to={`/related?id=69849f299a77c6ecd3c2839b`}><li><span className="dropdown-item rounded-3">Airpods</span></li></Link>
                                    <Link className="text-decoration-none" to={`/related?id=69849fa89a77c6ecd3c283af`}><li><span className="dropdown-item rounded-3">Cameras</span></li></Link>
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
                                <ul className="dropdown-menu shadow-lg border-0 rounded-4 p-2">
                                  <Link className="text-decoration-none" to="/about"><li><span className="dropdown-item rounded-3">About Us</span></li></Link>
                                    <Link className="text-decoration-none" to="/contact"><li><span className="dropdown-item rounded-3">Contact Us</span></li></Link>
                                    <Link className="text-decoration-none" to="/myorder"><li><span className="dropdown-item rounded-3">My Orders</span></li></Link>
                                    <Link className="text-decoration-none" to="/vendor"><li><span className="dropdown-item rounded-3">Become Vendor</span></li></Link>
                                    <Link className="text-decoration-none" to="/vlogin"><li><span className="dropdown-item rounded-3">Vendor Portal</span></li></Link>
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
                                <ul className="dropdown-menu shadow-lg border-0 rounded-4 p-2">
                                    <li className="dropdown-item">
                                        {flag ? <>
                                            <p onClick={logout} className="text-danger m-0 text-center fw-semibold style-pointer">
                                                Logout
                                            </p></>
                                            : <>
                                                <Link className="dropdown-item text-center rounded-3 mb-1" to="/login">Log In</Link>
                                                <Link className="dropdown-item text-center rounded-3 fw-semibold text-primary" to="/register">Sign Up</Link>
                                            </>}
                                    </li>
                                </ul>
                            </li>
                        </ul>

                        <div className="ms-lg-4 d-flex align-items-center gap-2">
                            <button 
                                className="btn btn-theme-toggle p-2 shadow-sm rounded-circle d-flex align-items-center justify-content-center" 
                                onClick={toggleTheme} 
                                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                                aria-pressed={theme === "dark"}
                                style={{ width: "40px", height: "40px", border: "1px solid var(--line)" }}
                            >
                                {theme === "dark" ? (
                                    <i className="bi bi-sun-fill text-warning fs-5"></i>
                                ) : (
                                    <i className="bi bi-moon-stars-fill text-primary fs-5"></i>
                                )}
                            </button>
                            <button className="btn btn-light p-2 position-relative shadow-sm" onClick={() => cart()} title="Cart">
                                <i className="bi bi-bag-fill fs-5 text-dark"></i>
                            </button>
                            <button className="btn btn-light  p-2 position-relative shadow-sm" onClick={() => wish()} title="Wishlist">
                                <i className="bi bi-heart-fill fs-5 text-danger"></i>
                            </button>
                            {flag ? (
                                <button className="btn btn-outline-danger btn-sm rounded-pill px-3 ms-2 fw-semibold" onClick={logout}>Logout</button>
                            ) : (
                                <button className="btn btn-primary btn-sm rounded-pill px-4 ms-2 fw-semibold shadow-sm" onClick={() => { navigate("/login") }}>Sign In</button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>




            {/* moblie */}
            <div className="offcanvas offcanvas-start d-lg-none" tabIndex="-1" id="mobileOffcanvas" aria-labelledby="mobileOffcanvasLabel">
                <div className="offcanvas-header border-bottom d-flex align-items-center justify-content-between">
                    <h5 className="offcanvas-title fw-bold m-0" id="mobileOffcanvasLabel">ElectoMart</h5>
                    <div className="d-flex align-items-center gap-2">
                        <button 
                            className="btn btn-theme-toggle p-2 shadow-sm rounded-circle d-flex align-items-center justify-content-center" 
                            onClick={toggleTheme} 
                            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                            aria-pressed={theme === "dark"}
                            style={{ width: "36px", height: "36px", border: "1px solid var(--line)" }}
                        >
                            {theme === "dark" ? (
                                <i className="bi bi-sun-fill text-warning fs-6"></i>
                            ) : (
                                <i className="bi bi-moon-stars-fill text-primary fs-6"></i>
                            )}
                        </button>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav">
                        <li className="nav-item" data-bs-dismiss="offcanvas">
                            <Link to="/" className="nav-link active fw-semibold py-3 text-start " >
                                Home
                            </Link>
                        </li>

                        <li className="nav-item" data-bs-dismiss="offcanvas">
                            <Link to="/about" className="nav-link text-start ">
                                About
                            </Link>
                        </li>


                        <li className="nav-item" >
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
                                <div className="ps-4 py-2" data-bs-dismiss="offcanvas">
                                   <Link className="text-decoration-none text-black" to={`/related?id=6970dd16300a757a6dcdb928`}><li><a className="dropdown-item">LED</a></li></Link>
                                    <Link className="text-decoration-none text-black" to={`/related?id=6970dd60300a757a6dcdb92e`}><li><a className="dropdown-item">Laptops</a></li></Link>
                                    <Link className="text-decoration-none text-black" to={`/related?id=6970dd2d300a757a6dcdb92a`}><li><a className="dropdown-item">Mobiles</a></li></Link>
                                    <Link className="text-decoration-none text-black" to={`/related?id=69849f299a77c6ecd3c2839b`}><li><a className="dropdown-item">Airpods</a></li></Link>
                                    <Link className="text-decoration-none text-black" to={`/related?id=69849fa89a77c6ecd3c283af`}><li><a className="dropdown-item">Cameras</a></li></Link>
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
                                <div className="ps-4 py-2 " data-bs-dismiss="offcanvas">
                                    <Link to="/about" className="dropdown-item py-2">About Us</Link>
                                    <Link className="dropdown-item py-2" >Contact Us</Link>
                                    <Link to="/myorder" className="dropdown-item py-2">Order</Link>
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
                                <div className="ps-4 py-2" data-bs-dismiss="offcanvas">
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
                        <i className=" bi bi-search"
                         data-bs-toggle="offcanvas"
                            data-bs-target="#searchOffcanvas"
                            aria-controls="searchOffcanvas"
                            aria-label="Toggle navigation"></i><br></br>
                        <span className=''>Search</span>
                    </div>
                    <div className="btn text-white" onClick={() => { navigate("/myorder") }}>
                        <i className="bi bi-bag-fill" ></i><br></br>
                        <span className='' >Order</span>
                    </div>
                    <div className="btn text-white" onClick={() => { wish() }}>
                        <i className="bi bi-heart-fill"></i><br></br>
                        <span className=''>Wishlist</span>
                    </div>
                    <div className="btn text-white" onClick={() => { cart() }}>
                        <i class="bi bi-cart-fill"></i><br></br>
                        <span className=''>Cart</span>
                    </div>
                   {
                    flag ? <div className="btn text-white" onClick={() => { logout() }}>
                    <i className="bi bi-box-arrow-right"></i><br></br>
                    <span className=''>Logout</span>
                </div> : <div className="btn text-white" onClick={() => { navigate("/login") }}>
                    <i className="bi bi-person-fill"></i><br></br>
                    <span className=''>Login</span>
                </div>
                   }

                </div>

            </div>
        <div className="offcanvas offcanvas-start d-lg-none" id="searchOffcanvas" tabindex="-1" aria-labelledby="searchOffcanvasLabel">
            <div className="offcanvas-header border-bottom">
                <h4 className="offcanvas-title" id="searchOffcanvasLabel">Search</h4>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"  ></button>
            </div>
            <div className="offcanvas-body">
                 <div className="search-box">
  <input
    className="ms-3 form-control rounded-pill"
    type="text"
    placeholder="Search..."
    onChange={(e) => {setsearch(e.target.value)}}
  />
    
   {search.length > 0 && (
    <ul className="search-result">
      {filteredProducts.map((a) => (
        <Link key={a._id} to={`/detail?id=${a._id}&cid=${a.Category}`} className="text-decoration-none text-dark"   onClick={() => setsearch("")}>
          <li className="py-2" data-bs-dismiss="offcanvas">{a.ProductName}</li>
        </Link>
      ))}
    </ul>
  )}
</div>

            </div>
        </div>
        </>
    )
}
