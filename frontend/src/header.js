import { Link, useNavigate, useLocation } from "react-router-dom"
import { useContext, useState, useEffect, useRef } from "react"
import Swal from "sweetalert2"
import { Context } from "./usecontext"
import logo from "./images/WhatsApp Image 2026-02-12 at 11.08.16 AM.png"
import { motion } from 'framer-motion'
import ThemeToggle from "./ThemeToggle"
import { API_BASE } from "./apiConfig"
import "./Header.css"

export const Header = () => {
    const { id, cartCount, setIsCartOpen, logoutAuth } = useContext(Context)
    const flag = Boolean(id || localStorage.getItem("data"))
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [search, setSearch] = useState("")
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const searchContainerRef = useRef(null)
    const mobileSearchRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()

    // Load products and categories once on mount for instant responsive search & navigation
    useEffect(() => {
        let isMounted = true;
        const fetchInitialData = async () => {
            try {
                const [prodRes, catRes] = await Promise.allSettled([
                    fetch(`${API_BASE}/api/getproduct`),
                    fetch(`${API_BASE}/api/getcategory`)
                ]);

                if (prodRes.status === "fulfilled" && prodRes.value.ok) {
                    const res = await prodRes.value.json();
                    if (isMounted && res.statuscode === 1 && Array.isArray(res.data)) {
                        setProducts(res.data);
                    }
                }

                if (catRes.status === "fulfilled" && catRes.value.ok) {
                    const cRes = await catRes.value.json();
                    if (isMounted && cRes.statuscode === 1 && Array.isArray(cRes.data)) {
                        setCategories(cRes.data);
                    }
                }
            } catch (err) {
                console.error("Failed to load header data:", err);
            }
        };

        fetchInitialData();
        return () => { isMounted = false; };
    }, []);

    // Close search dropdown on click outside or Escape key
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const filteredProducts = search.trim().length > 0
        ? products.filter((p) =>
            (p.ProductName || "").toLowerCase().includes(search.trim().toLowerCase())
        )
        : [];

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setIsSearchOpen(true);
    };

    const clearSearch = () => {
        setSearch("");
        setIsSearchOpen(false);
    };

    const logout = () => {
        if (logoutAuth) {
            logoutAuth();
        } else {
            localStorage.removeItem("data");
        }
        Swal.fire({
            title: "Logged Out",
            text: "You have been successfully logged out.",
            icon: "success",
            timer: 1600,
            showConfirmButton: false
        });
        navigate("/");
    };

    const handleCartClick = () => {
        if (id) {
            setIsCartOpen(true);
        } else {
            navigate("/login");
        }
    };

    const handleWishlistClick = () => {
        if (id) {
            navigate("/wish");
        } else {
            navigate("/login");
        }
    };

    const getProductImg = (item) => {
        const raw = item.Img || item.ProductImage || item.pic;
        if (!raw) return null;
        if (raw.startsWith("http") || raw.startsWith("/") || raw.startsWith("data:")) {
            return raw;
        }
        return `/uploads/${raw}`;
    };

    const formatPrice = (price) => {
        if (!price && price !== 0) return "";
        return `₹${Number(price).toLocaleString('en-IN')}`;
    };

    // Helper for active navigation link
    const isNavActive = (path) => location.pathname === path;

    // Fallback categories if database has not yet responded
    const displayCategories = categories.length > 0 ? categories : [
        { _id: "6970dd16300a757a6dcdb928", Name: "LED TVs" },
        { _id: "6970dd60300a757a6dcdb92e", Name: "Laptops" },
        { _id: "6970dd2d300a757a6dcdb92a", Name: "Mobiles" },
        { _id: "69849f299a77c6ecd3c2839b", Name: "Airpods" },
        { _id: "69849fa89a77c6ecd3c283af", Name: "Cameras" }
    ];

    return (
        <>
            <nav className="navbar navbar-expand-lg sticky-glass-nav" aria-label="Main Navigation">
                <div className="container">
                    {/* Left: Mobile Toggle & Brand Logo */}
                    <div className="d-flex align-items-center gap-2 gap-md-3">
                        <button
                            className="header-mobile-toggler d-lg-none"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#mobileOffcanvas"
                            aria-controls="mobileOffcanvas"
                            aria-label="Open mobile menu"
                        >
                            <i className="bi bi-list fs-4"></i>
                        </button>

                        <Link to="/" className="header-brand-link" title="ElectoMart Home">
                            <motion.img 
                                src={logo} 
                                alt="ElectoMart Logo" 
                                className="header-logo-img" 
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            />
                        </Link>
                    </div>

                    {/* Center: Sleek Live Search Bar (Desktop) */}
                    <div className="header-search-container d-none d-lg-block mx-lg-3" ref={searchContainerRef}>
                        <div className="header-search-bar">
                            <i className="bi bi-search header-search-icon"></i>
                            <input
                                className="header-search-input"
                                type="text"
                                value={search}
                                placeholder="Search electronics, brands, models..."
                                aria-label="Search products"
                                onChange={handleSearchChange}
                                onFocus={() => { if (search.trim().length > 0) setIsSearchOpen(true); }}
                            />
                            {search.length > 0 && (
                                <button 
                                    className="header-search-clear" 
                                    type="button" 
                                    onClick={clearSearch} 
                                    aria-label="Clear search text"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            )}
                        </div>

                        {/* Live Search Results Dropdown */}
                        {isSearchOpen && search.trim().length > 0 && (
                            <div className="header-search-dropdown shadow-lg">
                                <div className="header-search-dropdown-header">
                                    <span>Matching Products</span>
                                    <span>{filteredProducts.length} found</span>
                                </div>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.slice(0, 6).map((item) => {
                                        const imgSrc = getProductImg(item);
                                        return (
                                            <Link
                                                key={item._id}
                                                to={`/detail?id=${item._id}&cid=${item.Category || ''}`}
                                                className="header-search-result-item"
                                                onClick={clearSearch}
                                            >
                                                {imgSrc ? (
                                                    <img
                                                        src={imgSrc}
                                                        alt={item.ProductName}
                                                        className="header-search-thumb"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="header-search-thumb d-flex align-items-center justify-content-center text-muted">
                                                        <i className="bi bi-laptop"></i>
                                                    </div>
                                                )}
                                                <div className="header-search-info">
                                                    <p className="header-search-title">{item.ProductName}</p>
                                                    {item.Price && (
                                                        <span className="header-search-price">{formatPrice(item.Price)}</span>
                                                    )}
                                                </div>
                                                <i className="bi bi-chevron-right text-muted small ms-auto"></i>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="p-3 text-center text-muted small">
                                        <i className="bi bi-search me-1"></i> No matching products found for "{search}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Quick Action Buttons (Right) */}
                    <div className="d-lg-none d-flex align-items-center gap-2">
                        <ThemeToggle />
                        <button 
                            className="header-circle-btn" 
                            onClick={handleCartClick} 
                            aria-label="View Shopping Cart"
                        >
                            <i className="bi bi-bag-fill fs-6"></i>
                            {cartCount > 0 && (
                                <span className="header-badge">{cartCount}</span>
                            )}
                        </button>
                    </div>

                    {/* Desktop Navigation Links & Action Buttons */}
                    <div className="collapse navbar-collapse d-none d-lg-flex justify-content-end align-items-center" id="mainNavbar">
                        <ul className="header-nav-list me-lg-3">
                            <li className="nav-item">
                                <Link to="/" className={`header-nav-link ${isNavActive("/") ? "active" : ""}`}>
                                    Home
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/about" className={`header-nav-link ${isNavActive("/about") ? "active" : ""}`}>
                                    About
                                </Link>
                            </li>

                            {/* Products Mega Dropdown */}
                            <li className="nav-item dropdown">
                                <button
                                    className={`header-nav-link dropdown-toggle ${location.pathname.startsWith('/related') ? "active" : ""}`}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Products
                                </button>
                                <ul className="dropdown-menu header-dropdown-menu">
                                    {displayCategories.map((cat) => (
                                        <li key={cat._id}>
                                            <Link 
                                                className="dropdown-item header-dropdown-item" 
                                                to={`/related?id=${cat._id}`}
                                            >
                                                <i className="bi bi-grid-3x3-gap text-primary"></i>
                                                <span>{cat.Name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {/* Features Dropdown */}
                            <li className="nav-item dropdown">
                                <button
                                    className="header-nav-link dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Features
                                </button>
                                <ul className="dropdown-menu header-dropdown-menu">
                                    <li>
                                        <Link className="dropdown-item header-dropdown-item" to="/about">
                                            <i className="bi bi-info-circle text-info"></i>
                                            <span>About Us</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item header-dropdown-item" to="/contact">
                                            <i className="bi bi-envelope text-primary"></i>
                                            <span>Contact Us</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item header-dropdown-item" to="/myorder">
                                            <i className="bi bi-box-seam text-warning"></i>
                                            <span>My Orders</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item header-dropdown-item" to="/vendor">
                                            <i className="bi bi-shop text-success"></i>
                                            <span>Become a Vendor</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item header-dropdown-item" to="/vlogin">
                                            <i className="bi bi-shield-lock text-purple"></i>
                                            <span>Vendor Portal</span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            {/* Account Dropdown */}
                            <li className="nav-item dropdown">
                                <button
                                    className="header-nav-link dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Account
                                </button>
                                <ul className="dropdown-menu header-dropdown-menu" style={{ minWidth: "190px" }}>
                                    {flag ? (
                                        <>
                                            <li>
                                                <Link className="dropdown-item header-dropdown-item" to="/profile">
                                                    <i className="bi bi-person-circle text-primary"></i>
                                                    <span>My Profile</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item header-dropdown-item" to="/myorder">
                                                    <i className="bi bi-box-seam text-info"></i>
                                                    <span>My Orders</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item header-dropdown-item" to="/wish">
                                                    <i className="bi bi-heart-fill text-danger"></i>
                                                    <span>Wishlist</span>
                                                </Link>
                                            </li>
                                            <li><hr className="dropdown-divider my-1 opacity-25" /></li>
                                            <li>
                                                <button onClick={logout} className="dropdown-item header-dropdown-item text-danger w-100 text-start border-0 bg-transparent">
                                                    <i className="bi bi-box-arrow-right text-danger"></i>
                                                    <span>Sign Out</span>
                                                </button>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>
                                                <Link className="dropdown-item header-dropdown-item" to="/login">
                                                    <i className="bi bi-box-arrow-in-right text-primary"></i>
                                                    <span>Log In</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item header-dropdown-item fw-semibold text-primary" to="/register">
                                                    <i className="bi bi-person-plus text-primary"></i>
                                                    <span>Create Account</span>
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </li>
                        </ul>

                        {/* Action Icons and Auth CTA Button */}
                        <div className="header-actions-group">
                            <ThemeToggle />

                            <button 
                                className="header-circle-btn" 
                                onClick={handleWishlistClick} 
                                title="Wishlist" 
                                aria-label="View Wishlist"
                            >
                                <i className="bi bi-heart-fill fs-6 text-danger"></i>
                            </button>

                            <button 
                                className="header-circle-btn" 
                                onClick={handleCartClick} 
                                title="Cart" 
                                aria-label="View Shopping Cart"
                            >
                                <i className="bi bi-bag-fill fs-6"></i>
                                {cartCount > 0 && (
                                    <span className="header-badge">{cartCount}</span>
                                )}
                            </button>

                            {flag ? (
                                <button 
                                    className="header-auth-btn header-auth-btn-outline" 
                                    onClick={logout}
                                    type="button"
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Logout</span>
                                </button>
                            ) : (
                                <button 
                                    className="header-auth-btn header-auth-btn-primary" 
                                    onClick={() => navigate("/login")}
                                    type="button"
                                >
                                    <i className="bi bi-person-fill"></i>
                                    <span>Sign In</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Offcanvas */}
            <div className="offcanvas offcanvas-start mobile-offcanvas-custom d-lg-none" tabIndex="-1" id="mobileOffcanvas" aria-labelledby="mobileOffcanvasLabel">
                <div className="offcanvas-header border-bottom d-flex align-items-center justify-content-between p-3">
                    <div className="d-flex align-items-center gap-2">
                        <img src={logo} alt="ElectoMart Logo" style={{ height: "34px" }} />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <ThemeToggle />
                        <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                </div>
                <div className="offcanvas-body p-3">
                    {/* Mobile Quick Search Button */}
                    <div className="mb-3">
                        <button
                            className="w-100 d-flex align-items-center justify-content-between header-search-bar border-0 text-muted px-3 py-2"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#searchOffcanvas"
                            aria-controls="searchOffcanvas"
                        >
                            <span className="small"><i className="bi bi-search me-2"></i>Search products, brands...</span>
                            <span className="badge bg-primary rounded-pill px-2 py-1 small">Search</span>
                        </button>
                    </div>

                    <ul className="navbar-nav">
                        <li className="nav-item" data-bs-dismiss="offcanvas">
                            <Link to="/" className={`mobile-nav-link ${isNavActive("/") ? "active" : ""}`}>
                                <span><i className="bi bi-house me-2"></i>Home</span>
                                <i className="bi bi-chevron-right small text-muted"></i>
                            </Link>
                        </li>

                        <li className="nav-item" data-bs-dismiss="offcanvas">
                            <Link to="/about" className={`mobile-nav-link ${isNavActive("/about") ? "active" : ""}`}>
                                <span><i className="bi bi-info-circle me-2"></i>About Us</span>
                                <i className="bi bi-chevron-right small text-muted"></i>
                            </Link>
                        </li>

                        {/* Mobile Products Collapse */}
                        <li className="nav-item">
                            <a
                                className="mobile-nav-link"
                                data-bs-toggle="collapse"
                                href="#productsCollapse"
                                role="button"
                                aria-expanded="false"
                                aria-controls="productsCollapse"
                            >
                                <span><i className="bi bi-grid me-2"></i>Products</span>
                                <i className="bi bi-chevron-down small"></i>
                            </a>
                            <div className="collapse" id="productsCollapse">
                                <div className="ps-3 py-1" data-bs-dismiss="offcanvas">
                                    {displayCategories.map((cat) => (
                                        <Link 
                                            key={cat._id}
                                            className="mobile-subnav-link" 
                                            to={`/related?id=${cat._id}`}
                                        >
                                            <i className="bi bi-arrow-right-short text-primary me-1"></i>
                                            {cat.Name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </li>

                        {/* Mobile Features Collapse */}
                        <li className="nav-item">
                            <a
                                className="mobile-nav-link"
                                data-bs-toggle="collapse"
                                href="#featuresCollapse"
                                role="button"
                                aria-expanded="false"
                                aria-controls="featuresCollapse"
                            >
                                <span><i className="bi bi-stars me-2"></i>Features</span>
                                <i className="bi bi-chevron-down small"></i>
                            </a>
                            <div className="collapse" id="featuresCollapse">
                                <div className="ps-3 py-1" data-bs-dismiss="offcanvas">
                                    <Link to="/about" className="mobile-subnav-link">
                                        <i className="bi bi-info-circle me-2 text-info"></i>About Us
                                    </Link>
                                    <Link to="/contact" className="mobile-subnav-link">
                                        <i className="bi bi-envelope me-2 text-primary"></i>Contact Us
                                    </Link>
                                    <Link to="/myorder" className="mobile-subnav-link">
                                        <i className="bi bi-box-seam me-2 text-warning"></i>My Orders
                                    </Link>
                                    <Link to="/vendor" className="mobile-subnav-link">
                                        <i className="bi bi-shop me-2 text-success"></i>Become a Vendor
                                    </Link>
                                </div>
                            </div>
                        </li>

                        {/* Mobile Account Section */}
                        <li className="nav-item">
                            <a
                                className="mobile-nav-link"
                                data-bs-toggle="collapse"
                                href="#accountCollapse"
                                role="button"
                                aria-expanded="false"
                                aria-controls="accountCollapse"
                            >
                                <span><i className="bi bi-person me-2"></i>Account</span>
                                <i className="bi bi-chevron-down small"></i>
                            </a>
                            <div className="collapse" id="accountCollapse">
                                <div className="ps-3 py-1" data-bs-dismiss="offcanvas">
                                    {flag ? (
                                        <>
                                            <Link to="/profile" className="mobile-subnav-link">
                                                <i className="bi bi-person-circle me-2 text-primary"></i>My Profile
                                            </Link>
                                            <Link to="/myorder" className="mobile-subnav-link">
                                                <i className="bi bi-box-seam me-2 text-info"></i>My Orders
                                            </Link>
                                            <Link to="/wish" className="mobile-subnav-link">
                                                <i className="bi bi-heart me-2 text-danger"></i>Wishlist
                                            </Link>
                                            <button 
                                                onClick={logout} 
                                                className="mobile-subnav-link text-danger border-0 bg-transparent text-start w-100"
                                            >
                                                <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="mobile-subnav-link">
                                                <i className="bi bi-box-arrow-in-right me-2 text-primary"></i>Login
                                            </Link>
                                            <Link to="/register" className="mobile-subnav-link">
                                                <i className="bi bi-person-plus me-2 text-success"></i>Create Account
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                    </ul>

                    {/* Support Contact Info */}
                    <div className="mt-4 pt-3 border-top">
                        <p className="text-uppercase small fw-bold text-muted mb-2">Need Help?</p>
                        <div className="d-flex align-items-center gap-2 mb-2 small">
                            <i className="bi bi-telephone text-primary"></i>
                            <span className="text-muted">Direct Support:</span>
                            <strong>+91 98765 43210</strong>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-2 small">
                            <i className="bi bi-envelope text-info"></i>
                            <span className="text-muted">Email:</span>
                            <strong>support@electomart.com</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Fixed Bar */}
            <div className="bottom-toolbar d-lg-none">
                <div 
                    className="btn text-white p-1" 
                    data-bs-toggle="offcanvas"
                    data-bs-target="#searchOffcanvas"
                    aria-controls="searchOffcanvas"
                    aria-label="Search"
                >
                    <i className="bi bi-search"></i>
                    <span>Search</span>
                </div>
                <div className="btn text-white p-1" onClick={() => navigate("/myorder")}>
                    <i className="bi bi-bag-check"></i>
                    <span>Orders</span>
                </div>
                <div className="btn text-white p-1" onClick={handleWishlistClick}>
                    <i className="bi bi-heart-fill text-danger"></i>
                    <span>Wishlist</span>
                </div>
                <div className="btn text-white p-1 position-relative" onClick={handleCartClick}>
                    <i className="bi bi-cart-fill"></i>
                    {cartCount > 0 && (
                        <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.55rem" }}>
                            {cartCount}
                        </span>
                    )}
                    <span>Cart</span>
                </div>
                {flag ? (
                    <div className="btn text-white p-1" onClick={logout}>
                        <i className="bi bi-box-arrow-right text-danger"></i>
                        <span>Logout</span>
                    </div>
                ) : (
                    <div className="btn text-white p-1" onClick={() => navigate("/login")}>
                        <i className="bi bi-person-fill"></i>
                        <span>Login</span>
                    </div>
                )}
            </div>

            {/* Dedicated Mobile Search Offcanvas */}
            <div className="offcanvas offcanvas-top mobile-offcanvas-custom d-lg-none" tabIndex="-1" id="searchOffcanvas" aria-labelledby="searchOffcanvasLabel" style={{ height: "70vh" }}>
                <div className="offcanvas-header border-bottom p-3">
                    <h5 className="offcanvas-title fw-bold m-0" id="searchOffcanvasLabel">Search ElectoMart</h5>
                    <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-3">
                    <div className="header-search-bar mb-3">
                        <i className="bi bi-search header-search-icon"></i>
                        <input
                            ref={mobileSearchRef}
                            className="header-search-input"
                            type="text"
                            value={search}
                            placeholder="Search products, brands, models..."
                            onChange={handleSearchChange}
                            autoFocus
                        />
                        {search.length > 0 && (
                            <button className="header-search-clear" type="button" onClick={clearSearch}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        )}
                    </div>

                    {search.trim().length > 0 && (
                        <div className="mobile-search-results">
                            <p className="text-muted small fw-semibold mb-2">
                                {filteredProducts.length} Results Found
                            </p>
                            {filteredProducts.map((item) => {
                                const imgSrc = getProductImg(item);
                                return (
                                    <Link
                                        key={item._id}
                                        to={`/detail?id=${item._id}&cid=${item.Category || ''}`}
                                        className="header-search-result-item"
                                        data-bs-dismiss="offcanvas"
                                        onClick={clearSearch}
                                    >
                                        {imgSrc ? (
                                            <img src={imgSrc} alt={item.ProductName} className="header-search-thumb" />
                                        ) : (
                                            <div className="header-search-thumb d-flex align-items-center justify-content-center text-muted">
                                                <i className="bi bi-laptop"></i>
                                            </div>
                                        )}
                                        <div className="header-search-info">
                                            <p className="header-search-title">{item.ProductName}</p>
                                            {item.Price && (
                                                <span className="header-search-price">{formatPrice(item.Price)}</span>
                                            )}
                                        </div>
                                        <i className="bi bi-chevron-right text-muted small ms-auto"></i>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
