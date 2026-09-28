import { useState, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "./usecontext";
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageModal } from "./ImageModal";
import { SEO } from "./SEO";
import { API_BASE } from "./apiConfig";
import './Related.css';

export const Related = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [activeCategoryName, setActiveCategoryName] = useState("Electronics & Tech");
    const [loading, setLoading] = useState(true);

    const [pricesort, setpricesort] = useState("");
    const [brandSort, setbrandSort] = useState("");
    const [pr] = useSearchParams();
    const navigate = useNavigate();

    const prr = pr.get("id");
    const searchQueryParam = pr.get("search") || "";
    const [inpageSearch, setInpageSearch] = useState(searchQueryParam);

    const { id, setIsCartOpen, fetchCart } = useContext(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ img: "", title: "", price: "", salePrice: "" });

    const openImageModal = (imgSrc, titleText, itemPrice, itemSalePrice) => {
        setModalData({
            img: imgSrc,
            title: titleText,
            price: itemPrice,
            salePrice: itemSalePrice
        });
        setIsModalOpen(true);
    };

    // 1. Fetch Categories to resolve the active category name dynamically
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/getcategory`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.statuscode === 1 && Array.isArray(data.data)) {
                        if (prr) {
                            const found = data.data.find(c => String(c._id) === String(prr));
                            if (found && found.Name) {
                                setActiveCategoryName(found.Name);
                            }
                        } else if (searchQueryParam) {
                            setActiveCategoryName(`Search Results for "${searchQueryParam}"`);
                        } else {
                            setActiveCategoryName("All Tech Products");
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, [prr, searchQueryParam]);

    // 2. Fetch Products: with smart fallback to /api/getproduct if no category ID is in URL
    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchProducts = async () => {
            try {
                // If category ID is provided, query by category; otherwise fetch all products
                const endpoint = prr
                    ? `${API_BASE}/api/related/${prr}`
                    : `${API_BASE}/api/getproduct`;

                const res = await fetch(endpoint);
                if (res.ok) {
                    const json = await res.json();
                    if (isMounted) {
                        if (json.statuscode === 1 && Array.isArray(json.data)) {
                            setProducts(json.data);
                        } else {
                            setProducts([]);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
                if (isMounted) setProducts([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProducts();
        return () => { isMounted = false; };
    }, [prr]);

    // 3. Fetch Brands: for category or all brands as fallback
    useEffect(() => {
        let isMounted = true;
        const fetchBrands = async () => {
            try {
                const endpoint = prr
                    ? `${API_BASE}/api/getbrand/${prr}`
                    : `${API_BASE}/api/showbrand`;

                const res = await fetch(endpoint);
                if (res.ok) {
                    const json = await res.json();
                    if (isMounted) {
                        if (json.statuscode === 1 && Array.isArray(json.data) && json.data.length > 0) {
                            setBrands(json.data);
                        } else {
                            // Fallback to all brands if category has no specific brand relation
                            const fallback = await fetch(`${API_BASE}/api/showbrand`);
                            if (fallback.ok) {
                                const fbJson = await fallback.json();
                                if (fbJson.statuscode === 1 && Array.isArray(fbJson.data)) {
                                    setBrands(fbJson.data);
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch brands:", err);
            }
        };
        fetchBrands();
        return () => { isMounted = false; };
    }, [prr]);

    // 4. Mount Splide Carousel safely
    useEffect(() => {
        if (!brands.length) return;
        const timer = setTimeout(() => {
            const el = document.querySelector(".brandSlider");
            const SplideConstructor = Splide || window.Splide?.Splide || window.Splide;
            if (typeof SplideConstructor === "function" && el) {
                try {
                    new SplideConstructor(el, {
                        perPage: 6,
                        gap: 16,
                        autoplay: true,
                        arrows: true,
                        pagination: false,
                        breakpoints: {
                            1200: { perPage: 5 },
                            992: { perPage: 4 },
                            768: { perPage: 3 },
                            480: { perPage: 2 },
                        },
                    }).mount();
                } catch (e) {
                    console.warn("Splide initialization warning:", e);
                }
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [brands]);

    // 5. Wishlist Handler
    const wish = async (uId, name, price, img, pId, salePrice) => {
        if (!uId) {
            Swal.fire({
                icon: "warning",
                title: "Please Login First",
                text: "Login to save items to your wishlist"
            });
            navigate("/login");
            return;
        }

        const data = { id: uId, name, price, img, prr: pId, saleprice: salePrice };
        try {
            const result = await fetch(`${API_BASE}/api/wishpost/${pId}`, {
                method: "post",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json;charset=UTF-8" }
            });
            if (result.ok) {
                const res = await result.json();
                if (res.statuscode === 2) {
                    Swal.fire({
                        icon: "info",
                        title: "❤️ Already in Wishlist",
                        text: res.message
                    });
                } else if (res.statuscode === 1) {
                    Swal.fire({
                        icon: "success",
                        title: "❤️ Added to Wishlist",
                        showConfirmButton: false,
                        timer: 1600
                    });
                } else {
                    Swal.fire("Notice", res.message || "Failed to update wishlist", "info");
                }
            }
        } catch (err) {
            console.error("Failed to post wish:", err);
            Swal.fire("Error", "Could not connect to server", "error");
        }
    };

    // 6. Cart Handler
    const cart = async (uId, name, price, img, value = 1, pId) => {
        if (!uId) {
            Swal.fire({
                icon: "warning",
                title: "Please Login First",
                text: "Login to add items to your cart"
            });
            navigate("/login");
            return;
        }

        const data = { id: uId, name, price, img, value };
        try {
            const result = await fetch(`${API_BASE}/api/cartdata/${pId}`, {
                method: "post",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json;charset=UTF-8" }
            });
            if (result.ok) {
                const res = await result.json();
                if (res.statuscode === 2 || res.statuscode === 1) {
                    await fetchCart();
                    setIsCartOpen(true);
                } else {
                    Swal.fire("Error", res.message || "Could not add to cart", "error");
                }
            }
        } catch (err) {
            console.error("Failed to add to cart:", err);
            Swal.fire("Error", "Could not connect to server", "error");
        }
    };

    const calculateDiscount = (original, sale) => {
        if (!original || !sale || original <= sale) return 0;
        return Math.round(((original - sale) / original) * 100);
    };

    // 7. Filter & Sort Pipeline
    const filteredProducts = useMemo(() => {
        return [...products]
            .filter((p) => {
                // Filter by Brand
                if (brandSort && String(p.Brand) !== String(brandSort)) {
                    return false;
                }
                // Filter by Search Query
                if (inpageSearch && inpageSearch.trim() !== "") {
                    const query = inpageSearch.toLowerCase().trim();
                    const nameMatch = p.ProductName?.toLowerCase().includes(query);
                    return Boolean(nameMatch);
                }
                return true;
            })
            .sort((a, b) => {
                const priceA = a.SalePrice || a.ProductPrice || 0;
                const priceB = b.SalePrice || b.ProductPrice || 0;
                if (pricesort === "low") {
                    return priceA - priceB;
                }
                if (pricesort === "high") {
                    return priceB - priceA;
                }
                return 0;
            });
    }, [products, brandSort, inpageSearch, pricesort]);

    const activeBrandName = useMemo(() => {
        if (!brandSort) return null;
        return brands.find(b => String(b._id) === String(brandSort))?.BrandName || "Selected Brand";
    }, [brandSort, brands]);

    const resetFilters = () => {
        setpricesort("");
        setbrandSort("");
        setInpageSearch("");
    };

    const activeFilterCount = (pricesort ? 1 : 0) + (brandSort ? 1 : 0) + (inpageSearch ? 1 : 0);

    return (
        <>
            <SEO
                title={`${activeCategoryName} | ElectoMart Gadgets`}
                description={`Browse our premium collection of ${activeCategoryName} with authentic warranty, fast shipping, and unbeatable prices.`}
                keywords={`${activeCategoryName}, electronics, gadgets, online tech shopping`}
            />

            {/* Hero Banner with Dynamic Category Heading */}
            <section className="related-hero-banner text-center">
                <div className="container">
                    <h1 className="related-hero-title">{activeCategoryName}</h1>
                    <ul className="related-breadcrumbs">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <i className="bi bi-chevron-right small text-muted"></i>
                        </li>
                        <li>
                            <span>Products</span>
                        </li>
                        {activeCategoryName && (
                            <>
                                <li>
                                    <i className="bi bi-chevron-right small text-muted"></i>
                                </li>
                                <li className="fw-semibold text-primary">{activeCategoryName}</li>
                            </>
                        )}
                    </ul>
                </div>
            </section>

            {/* Shop by Brand Splide Slider */}
            {brands.length > 0 && (
                <section className="container mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold fs-5 mb-0">Shop by Brand</h4>
                        {brandSort && (
                            <button
                                type="button"
                                className="btn btn-link text-decoration-none btn-sm text-danger p-0"
                                onClick={() => setbrandSort("")}
                            >
                                Clear Brand Filter ({activeBrandName})
                            </button>
                        )}
                    </div>

                    <div className="splide brandSlider">
                        <div className="splide__track">
                            <ul className="splide__list">
                                {brands.map((b) => {
                                    const isSelected = String(brandSort) === String(b._id);
                                    return (
                                        <li className="splide__slide" key={b._id}>
                                            <div
                                                className={`brand-slide-card text-center ${isSelected ? 'active' : ''}`}
                                                onClick={() => setbrandSort(isSelected ? "" : b._id)}
                                                title={isSelected ? "Click to clear filter" : `Filter by ${b.BrandName}`}
                                            >
                                                <img
                                                    src={`/uploads/${b.Img}`}
                                                    className="object-fit-contain rounded mx-auto mb-2"
                                                    style={{ width: "70px", height: "55px" }}
                                                    alt={b.BrandName || "Brand"}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = "/logo192.png";
                                                    }}
                                                />
                                                <h6 className="small fw-bold mb-0 text-truncate">{b.BrandName}</h6>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Product Catalog Section */}
            <div className="container mb-5">
                {/* Top Control Bar */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-2 border-bottom">
                    <div>
                        <h3 className="fw-bold fs-4 mb-1">Product Catalog</h3>
                        <p className="text-muted small mb-0">
                            Showing <strong className="text-dark">{filteredProducts.length}</strong> of {products.length} items
                        </p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {/* In-page live search */}
                        <div className="inpage-search-wrap">
                            <i className="bi bi-search inpage-search-icon"></i>
                            <input
                                type="text"
                                className="inpage-search-input"
                                placeholder="Search in this list..."
                                value={inpageSearch}
                                onChange={(e) => setInpageSearch(e.target.value)}
                            />
                        </div>

                        {/* Mobile Filter Button */}
                        <button
                            className="btn btn-outline-primary d-lg-none d-flex align-items-center gap-2 rounded-pill px-3"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#filterDrawer"
                        >
                            <i className="bi bi-sliders"></i>
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="badge bg-primary rounded-pill">{activeFilterCount}</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Active Filter Chips Bar */}
                {activeFilterCount > 0 && (
                    <div className="active-filters-bar">
                        <span className="small text-muted fw-bold me-1">Active:</span>

                        {pricesort && (
                            <span className="active-chip">
                                Sort: {pricesort === 'low' ? 'Low → High' : 'High → Low'}
                                <button type="button" onClick={() => setpricesort("")}>&times;</button>
                            </span>
                        )}

                        {brandSort && (
                            <span className="active-chip">
                                Brand: {activeBrandName}
                                <button type="button" onClick={() => setbrandSort("")}>&times;</button>
                            </span>
                        )}

                        {inpageSearch && (
                            <span className="active-chip">
                                Search: "{inpageSearch}"
                                <button type="button" onClick={() => setInpageSearch("")}>&times;</button>
                            </span>
                        )}

                        <button type="button" className="btn-clear-filters" onClick={resetFilters}>
                            Clear All
                        </button>
                    </div>
                )}

                <div className="row g-4">
                    {/* Desktop Filter Sidebar */}
                    <div className="col-lg-3 d-none d-lg-block">
                        <div className="related-sidebar-sticky">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">Filters</h5>
                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-link text-danger text-decoration-none btn-sm p-0 fw-semibold"
                                        onClick={resetFilters}
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>

                            {/* Sort Filter */}
                            <div className="mb-4">
                                <div className="filter-section-title">
                                    <span>Sort by Price</span>
                                    <i className="bi bi-arrow-down-up text-primary"></i>
                                </div>
                                <div className="sort-pills-list">
                                    <button
                                        type="button"
                                        className={`sort-pill-btn ${pricesort === '' ? 'active' : ''}`}
                                        onClick={() => setpricesort("")}
                                    >
                                        <span>Featured / Default</span>
                                        {pricesort === '' && <i className="bi bi-check-lg"></i>}
                                    </button>
                                    <button
                                        type="button"
                                        className={`sort-pill-btn ${pricesort === 'low' ? 'active' : ''}`}
                                        onClick={() => setpricesort("low")}
                                    >
                                        <span>Price: Low to High</span>
                                        {pricesort === 'low' && <i className="bi bi-check-lg"></i>}
                                    </button>
                                    <button
                                        type="button"
                                        className={`sort-pill-btn ${pricesort === 'high' ? 'active' : ''}`}
                                        onClick={() => setpricesort("high")}
                                    >
                                        <span>Price: High to Low</span>
                                        {pricesort === 'high' && <i className="bi bi-check-lg"></i>}
                                    </button>
                                </div>
                            </div>

                            {/* Brand Filter */}
                            {brands.length > 0 && (
                                <div>
                                    <div className="filter-section-title">
                                        <span>Filter by Brand</span>
                                        <i className="bi bi-tag text-primary"></i>
                                    </div>
                                    <div className="filter-brand-scroll">
                                        <div
                                            className={`filter-brand-item ${!brandSort ? 'active' : ''}`}
                                            onClick={() => setbrandSort("")}
                                        >
                                            <i className="bi bi-grid-fill me-1 text-muted"></i>
                                            <span>All Brands</span>
                                        </div>
                                        {brands.map((b) => (
                                            <div
                                                key={b._id}
                                                className={`filter-brand-item ${String(brandSort) === String(b._id) ? 'active' : ''}`}
                                                onClick={() => setbrandSort(String(brandSort) === String(b._id) ? "" : b._id)}
                                            >
                                                <i className={`bi ${String(brandSort) === String(b._id) ? 'bi-check-circle-fill text-primary' : 'bi-circle text-muted'} me-1`}></i>
                                                <span>{b.BrandName}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Products Grid Area */}
                    <div className="col-lg-9 col-12">
                        {loading ? (
                            /* Skeletons while loading */
                            <div className="row g-3 g-md-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="col-xl-4 col-md-4 col-sm-6 col-6">
                                        <div className="skeleton-card">
                                            <div className="skeleton-box w-100 mb-3" style={{ height: "150px" }}></div>
                                            <div className="skeleton-box w-75 mb-2" style={{ height: "18px" }}></div>
                                            <div className="skeleton-box w-50 mb-3" style={{ height: "14px" }}></div>
                                            <div className="skeleton-box w-100 mt-auto" style={{ height: "36px" }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <motion.div layout className="row g-3 g-md-4">
                                <AnimatePresence>
                                    {filteredProducts.map((b) => {
                                        const discount = calculateDiscount(b.ProductPrice, b.SalePrice);
                                        const displaySale = b.SalePrice || b.ProductPrice;
                                        const hasDiscount = discount > 0;

                                        return (
                                            <motion.div
                                                key={b._id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.25 }}
                                                className="col-xl-4 col-md-4 col-sm-6 col-6"
                                            >
                                                <div className="related-product-card">
                                                    {/* Badges */}
                                                    <div className="position-absolute top-0 start-0 m-2 z-2 d-flex flex-column gap-1">
                                                        {hasDiscount && (
                                                            <span className="badge-discount-fire shadow-sm">
                                                                <i className="bi bi-fire"></i> -{discount}% OFF
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Quick Action Dock */}
                                                    <div className="related-action-dock position-absolute top-0 end-0 m-2 z-2 d-flex flex-column gap-2">
                                                        <button
                                                            type="button"
                                                            className="related-dock-btn wishlist"
                                                            title="Add to wishlist"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                wish(id, b.ProductName, b.ProductPrice, b.Img, b._id, b.SalePrice);
                                                            }}
                                                        >
                                                            <i className="bi bi-heart-fill"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="related-dock-btn preview"
                                                            title="Quick View"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                openImageModal(b.Img, b.ProductName, b.ProductPrice, b.SalePrice);
                                                            }}
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                    </div>

                                                    {/* Product Image */}
                                                    <div
                                                        className="related-img-wrap"
                                                        onClick={() => openImageModal(b.Img, b.ProductName, b.ProductPrice, b.SalePrice)}
                                                        title="Click to zoom image"
                                                    >
                                                        <img
                                                            src={b.Img}
                                                            alt={b.ProductName || "Product"}
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.currentTarget.onerror = null;
                                                                e.currentTarget.src = "/logo192.png";
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Card Content */}
                                                    <div className="related-card-content">
                                                        {/* Ratings & Stock Row */}
                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <div className="related-rating small">
                                                                <i className="bi bi-star-fill text-warning me-1"></i>
                                                                <span className="fw-bold text-dark">4.5</span>
                                                                <span className="text-muted ms-1 small">(24)</span>
                                                            </div>
                                                            <span className="related-stock-tag small">
                                                                <i className="bi bi-check-circle-fill text-success me-1"></i>
                                                                In Stock
                                                            </span>
                                                        </div>

                                                        <Link
                                                            to={`/detail?id=${b._id}&cid=${b.Category || prr}`}
                                                            className="text-decoration-none"
                                                        >
                                                            <h6 className="related-card-title" title={b.ProductName}>
                                                                {b.ProductName}
                                                            </h6>
                                                        </Link>

                                                        {/* Price Block */}
                                                        <div className="related-price-row mb-3">
                                                            <span className="related-current-price">
                                                                ₹{displaySale}
                                                            </span>
                                                            {hasDiscount && (
                                                                <>
                                                                    <span className="related-original-price">
                                                                        ₹{b.ProductPrice}
                                                                    </span>
                                                                    <span className="related-save-tag">
                                                                        Save ₹{b.ProductPrice - b.SalePrice}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Card Bottom Actions */}
                                                        <div className="related-card-actions">
                                                            <Link
                                                                to={`/detail?id=${b._id}&cid=${b.Category || prr}`}
                                                                className="btn-card-detail"
                                                            >
                                                                <span>Details</span>
                                                                <i className="bi bi-arrow-right-short fs-6"></i>
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                className="btn-card-buy"
                                                                onClick={() => cart(id, b.ProductName, b.ProductPrice, b.Img, b.Quantity || 1, b._id)}
                                                            >
                                                                <i className="bi bi-cart-plus-fill"></i>
                                                                <span>Add</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            /* Empty State when no products match */
                            <div className="related-empty-state">
                                <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
                                <h4 className="fw-bold">No Products Found</h4>
                                <p className="text-muted mb-4" style={{ maxWidth: "420px", margin: "0 auto" }}>
                                    We couldn't find any items matching your active search and brand filters.
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-primary rounded-pill px-4"
                                    onClick={resetFilters}
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Offcanvas Drawer */}
            <div className="offcanvas offcanvas-start" id="filterDrawer" tabIndex="-1">
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title fw-bold">Filter Products</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {/* Sort Options */}
                    <div className="mb-4">
                        <h6 className="fw-bold mb-3">Sort by Price</h6>
                        <div className="d-flex flex-column gap-2">
                            <button
                                type="button"
                                className={`sort-pill-btn ${pricesort === '' ? 'active' : ''}`}
                                data-bs-dismiss="offcanvas"
                                onClick={() => setpricesort("")}
                            >
                                <span>Default / Featured</span>
                            </button>
                            <button
                                type="button"
                                className={`sort-pill-btn ${pricesort === 'low' ? 'active' : ''}`}
                                data-bs-dismiss="offcanvas"
                                onClick={() => setpricesort("low")}
                            >
                                <span>⬇ Price: Low to High</span>
                            </button>
                            <button
                                type="button"
                                className={`sort-pill-btn ${pricesort === 'high' ? 'active' : ''}`}
                                data-bs-dismiss="offcanvas"
                                onClick={() => setpricesort("high")}
                            >
                                <span>⬆ Price: High to Low</span>
                            </button>
                        </div>
                    </div>

                    {/* Brand Options */}
                    {brands.length > 0 && (
                        <div className="mb-4">
                            <h6 className="fw-bold mb-3">Filter by Brand</h6>
                            <div className="d-flex flex-column gap-1">
                                <button
                                    type="button"
                                    className={`filter-brand-item border-0 w-100 text-start ${!brandSort ? 'active' : ''}`}
                                    data-bs-dismiss="offcanvas"
                                    onClick={() => setbrandSort("")}
                                >
                                    <span>All Brands</span>
                                </button>
                                {brands.map((b) => (
                                    <button
                                        key={b._id}
                                        type="button"
                                        className={`filter-brand-item border-0 w-100 text-start ${String(brandSort) === String(b._id) ? 'active' : ''}`}
                                        data-bs-dismiss="offcanvas"
                                        onClick={() => setbrandSort(b._id)}
                                    >
                                        <span>{b.BrandName}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            className="btn btn-outline-danger w-100 rounded-pill mt-3"
                            data-bs-dismiss="offcanvas"
                            onClick={resetFilters}
                        >
                            Reset All Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Preview Image Modal */}
            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imgSrc={modalData.img}
                title={modalData.title}
                price={modalData.price}
                salePrice={modalData.salePrice}
            />
        </>
    );
};

export default Related;