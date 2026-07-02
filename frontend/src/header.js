import { Link, useNavigate } from "react-router-dom"
import { useContext, useState, useEffect ,useRef} from "react"
import Swal from "sweetalert2";
import { Context } from "./usecontext";
import logo from "./images/WhatsApp Image 2026-02-12 at 11.08.16 AM.png"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export const Header = () => {
    const [flag, setflag] = useState(false);
    const { id, setid } = useContext(Context)
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


            <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top ">
                <div className="container">
                    <div className="d-flex gap-4 ">
                        <button
                            className="navbar-toggler  d-lg-none"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#mobileOffcanvas"
                            aria-controls="mobileOffcanvas"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon "></span>
                        </button>
                        <Link to="/" className="navbar-brand fw-bold fs-4">
                            <img src={logo} alt="logo" style={{ height: "40px" }} className="navbar-logo" />

                        </Link>

                    </div>

 <div className="search-box d-none d-lg-block">
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
          <li>{a.ProductName}</li>
        </Link>
      ))}
    </ul>
  )}
</div>


                    <div className="collapse navbar-collapse d-none d-lg-block" id="navbarSupportedContent">


                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-2">

                            <li className="nav-item">
                               <Link to="/" className="nav-link active fw-semibold">
                                    Home
                                </Link >
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
                                  <Link className="text-decoration-none" to="/about"><li><a className="dropdown-item">About Us</a></li></Link>
                                    <Link className="text-decoration-none" to="/contact"><li><a className="dropdown-item">Contact Us</a></li></Link>
                                    <Link className="text-decoration-none" to="/myorder"><li><a className="dropdown-item">Order</a></li></Link>
                                    <Link className="text-decoration-none" to="/vendor"><li><a className="dropdown-item">Become Vendor</a></li></Link>
                                    <Link className="text-decoration-none" to="/vlogin"><li><a className="dropdown-item">Vendor Login</a></li></Link>
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
                      {
                        flag ? 
                            <div className="ms-5 d-flex align-items-center justify-content-center">
                            <button className="fs-4 btn" onClick={() => cart()} ><i className="bi bi-cart-fill"></i></button>
                            <div className="fs-4 btn"><i className="bi bi-heart-fill" onClick={() => wish()}></i></div>
                            <button className="btn bg-black text-white log-out ms-3 rounded-pill" onClick={logout}>Logout</button>
                        </div>
                        :<div className="ms-5 d-flex align-items-center justify-content-center">
                            <button className="fs-4 btn" onClick={() => cart()} ><i className="bi bi-cart-fill"></i></button>
                            <div className="fs-4 btn"><i className="bi bi-heart-fill" onClick={() => wish()}></i></div>
                               <button className="btn bg-black text-white log-out  ms-3 rounded-pill" onClick={()=>{navigate("/login")}}>LogIn</button>
                        </div>
                      }
                                            
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