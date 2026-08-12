
import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import banner2 from './images/banner2.png'
import banner1 from './images/banner1.png'
import banner3 from './images/banner3.png'
import { Context } from './usecontext'
import Swal from 'sweetalert2'
import AOS from "aos"
import "aos/dist/aos.css"
import Splide from '@splidejs/splide'
import '@splidejs/splide/css'
import { motion } from 'framer-motion'
import CursorGrid from './CursorGrid'
import Lightfall from './Lightfall'
import EchoText from './EchoText'

export const Main = () => {
    const [d, setd] = useState([])
    const [spro, setspro] = useState([])
    const [lpro, setlpro] = useState([])
    const [br, setbr] = useState([])
    const [idd, setidd] = useState()
    const [laptop, setlaptop] = useState([])
    const [mobile, setmobile] = useState([])
    const [led, setled] = useState([])
    const [airpod, setairpod] = useState([])
    const { id, theme } = useContext(Context)
    const [discount, setdiscount] = useState("")
    const [showTop, setShowTop] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(
        () => window.matchMedia?.("(max-width: 767px), (prefers-reduced-motion: reduce)")?.matches ?? false
    );
    const lightfallColors = useMemo(
        () => theme === 'dark'
            ? ['#A6C8FF', '#5227FF', '#FF9FFC', '#3B82F6']
            : ['#A6C8FF', '#5227FF', '#FF9FFC'],
        [theme]
    );

    const navigate = useNavigate()

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
            offset: 120
        })
    }, [])

    useEffect(() => {
        const mediaQuery = window.matchMedia?.("(max-width: 767px), (prefers-reduced-motion: reduce)");
        if (!mediaQuery) return undefined;
        const updateViewport = () => setIsMobile(mediaQuery.matches);

        updateViewport();
        mediaQuery.addEventListener("change", updateViewport);
        return () => mediaQuery.removeEventListener("change", updateViewport);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const el = document.querySelector(".categorySlider");
            const SplideConstructor = Splide || window.Splide?.Splide || window.Splide;
            if (typeof SplideConstructor === "function" && el) {
                try {
                    new SplideConstructor(el, {
                        perPage: 6,
                        gap: 20,
                        autoplay: true,
                        arrows: false,
                        pagination: false,
                        breakpoints: {
                            992: { perPage: 4, arrows: true },
                            768: { perPage: 3, arrows: true },
                            576: { perPage: 2, arrows: true },
                        },
                    }).mount();
                } catch (e) {
                    console.warn("Splide initialization warning:", e);
                }
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [d]);


    useEffect(() => {
  
        show();
        show2();
        show3();
        show4();
        show5();
        show6()
        show7()
        show8() 
        
    }, [])

    useEffect(() => {

        const handleScroll = () => {
            setShowTop(window.scrollY > window.innerHeight * 0.2);
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress(scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };

    }, []);





   const show = async () => {
    try {
        const result = await fetch("https://elcto-1.onrender.com/api/getcategory");

        const res = await result.json();

        if (res.statuscode === 1) {
            setd(res.data);
            setidd(res.data[0]?.Category);
        } else {
            alert("Error from API");
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
};
    const show2 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/saleproduct", {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {

                setspro(res.data)
            }
            else {
                alert("bbfb")
            }
        }
    }
    const show3 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/latestproduct", {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setlpro(res.data)
            }
            else {
                alert("bbfb")
            }
        }
    }
    const show4 = async () => {
        const result = await fetch(" https://elcto-1.onrender.com/api/showbrand", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setbr(res.data)
            }
            else {
                alert("rere")
            }
        }
    }
    const show5 = async () => {
        const result = await fetch(`https://elcto-1.onrender.com/api/laptop`, {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setlaptop(res.data)

            }
            else {
                alert("not found")
            }
        }
    }
    const show6 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/mobiles", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setmobile(res.data)
            }
            else {
                alert("sdfg")
            }
        }
    }
    const show7 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/leds", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setled(res.data)
            }
            else {
                alert("dfg")
            }
        }
    }
    const show8 = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/airpods", {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setairpod(res.data)
            }
            else {
                alert("d")
            }
        }
    }

    const wish = async (id, name, price, img, prr,saleprice) => {
          if (!id) {
        Swal.fire({
            icon: "warning",
            title: "Please Login First",
            text: "Login to add items to cart"
        })
        navigate("/login")
        return
    }

        const data = { id, name, price, img, prr, saleprice }
        const result = await fetch(`https://elcto-1.onrender.com/api/wishpost/${prr}`, {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result.ok) {
            const res = await result.json();

            if (res.statuscode === 2) {
                Swal.fire({
                    icon: "info",
                    title: "❤️ Already in Wishlist",
                    text: (res.message)
                })
            }

            else if (res.statuscode === 1) {
                navigate(`/wish?id=${id}`);
                Swal.fire({
                    icon: "success",
                    title: "❤️ Added in Wishlist",
                })
            }

            else {
                alert("Something went wrong");
            }

        }
    }
    const cart = async (id, name, price, img, value = 1, prr) => {
          if (!id) {
        Swal.fire({
            icon: "warning",
            title: "Please Login First",
            text: "Login to add items to cart"
        })
        navigate("/login")
        return
    }

        const data = { id, name, price, img, value }
        const result = await fetch(`https://elcto-1.onrender.com/api/cartdata/${prr}`, {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 2) {
                Swal.fire({
                    icon: "info",
                    title: "🛒 Already in Cart",
                    text: (res.message)
                });

            }
            else if (res.statuscode === 1) {
                navigate(`/cart?id=${id}`)
                Swal.fire({
                    icon: "success",
                    text: "🛒 Added to Cart"
                })
            }
            else {
                alert("dfg")
            }
        }
    }
    const gotop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
    const calculateDiscount = (original, sale) => {
        return Math.round(((original - sale) / original) * 100);
    }



    return (
        <>
    <div className='container-fluid px-0 px-md-3 py-2 py-md-3'>
        <style>{`
            @keyframes heroFadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(24px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes heroBadgePop {
                from {
                    opacity: 0;
                    transform: scale(0.85);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            @keyframes progressTimer {
                from { width: 0%; }
                to { width: 100%; }
            }

            .modern-hero-carousel {
                border-radius: 26px;
                overflow: hidden;
                box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.28);
                position: relative;
                background: #090d16;
            }
            @media (max-width: 768px) {
                .modern-hero-carousel {
                    border-radius: 18px;
                }
            }
            .modern-hero-carousel .carousel-item {
                position: relative;
                overflow: hidden;
            }
            .modern-hero-carousel .carousel-img-wrapper {
                position: relative;
                width: 100%;
                height: clamp(340px, 50vw, 620px);
                overflow: hidden;
            }
            .modern-hero-carousel .carousel-img-wrapper img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                transition: transform 9s cubic-bezier(0.25, 1, 0.5, 1);
            }
            .modern-hero-carousel .carousel-item.active .carousel-img-wrapper img {
                transform: scale(1.08);
            }

            .modern-hero-carousel .carousel-overlay {
                position: absolute;
                inset: 0;
                background: 
                    radial-gradient(circle at 75% 40%, rgba(15, 98, 254, 0.22) 0%, transparent 55%),
                    linear-gradient(90deg, rgba(8, 12, 24, 0.88) 0%, rgba(8, 12, 24, 0.55) 50%, rgba(8, 12, 24, 0.15) 100%);
                z-index: 1;
            }
            @media (max-width: 768px) {
                .modern-hero-carousel .carousel-overlay {
                    background: linear-gradient(180deg, rgba(8, 12, 24, 0.25) 0%, rgba(8, 12, 24, 0.92) 100%);
                }
            }

            .carousel-caption-content {
                position: absolute;
                inset: 0;
                z-index: 2;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                padding: 2.5rem clamp(1.5rem, 6vw, 5.5rem);
                color: #ffffff;
                text-align: left;
            }
            @media (max-width: 768px) {
                .carousel-caption-content {
                    justify-content: flex-end;
                    padding-bottom: 4rem;
                }
            }

            .hero-badge-animated {
                animation: heroBadgePop 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .hero-title-animated {
                animation: heroFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
            }
            .hero-desc-animated {
                animation: heroFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            }
            .hero-actions-animated {
                animation: heroFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards;
            }

            .modern-carousel-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                z-index: 5;
                width: 52px;
                height: 52px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.12);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.25);
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                opacity: 0.85;
            }
            .modern-carousel-btn:hover {
                background: rgba(255, 255, 255, 0.95);
                color: #0f172a;
                transform: translateY(-50%) scale(1.12);
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
                opacity: 1;
            }
            .modern-carousel-btn.prev-btn { left: 22px; }
            .modern-carousel-btn.next-btn { right: 22px; }
            @media (max-width: 576px) {
                .modern-carousel-btn {
                    width: 38px;
                    height: 38px;
                    font-size: 1rem;
                }
                .modern-carousel-btn.prev-btn { left: 10px; }
                .modern-carousel-btn.next-btn { right: 10px; }
            }

            .custom-carousel-indicators {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 5;
                display: flex;
                gap: 8px;
                margin: 0;
                padding: 6px 14px;
                background: rgba(10, 16, 30, 0.45);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border-radius: 30px;
                border: 1px solid rgba(255, 255, 255, 0.18);
            }
            .custom-carousel-indicators button {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: none;
                background-color: rgba(255, 255, 255, 0.4);
                transition: all 0.4s ease;
                padding: 0;
                cursor: pointer;
            }
            .custom-carousel-indicators button.active {
                width: 32px;
                border-radius: 12px;
                background-color: #ffffff;
                box-shadow: 0 0 14px rgba(255, 255, 255, 0.7);
            }

            .hero-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 7px 16px;
                border-radius: 30px;
                font-size: 0.78rem;
                font-weight: 700;
                letter-spacing: 0.09em;
                text-transform: uppercase;
                margin-bottom: 16px;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 18px rgba(0, 0, 0, 0.2);
            }
            .hero-title {
                font-size: clamp(2rem, 4.5vw, 3.6rem);
                font-weight: 800;
                line-height: 1.12;
                letter-spacing: -0.025em;
                text-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
                margin-bottom: 14px;
                max-width: 680px;
            }
            .hero-desc {
                font-size: clamp(0.92rem, 1.5vw, 1.15rem);
                color: rgba(255, 255, 255, 0.88);
                max-width: 540px;
                margin-bottom: 26px;
                line-height: 1.55;
            }

            .hero-primary-btn {
                padding: 13px 30px;
                border-radius: 30px;
                font-weight: 700;
                font-size: 0.95rem;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                display: inline-flex;
                align-items: center;
                gap: 8px;
                text-decoration: none;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
            }
            .hero-primary-btn:hover {
                transform: translateY(-3px) scale(1.02);
                box-shadow: 0 16px 35px rgba(0, 0, 0, 0.35);
            }
            .hero-secondary-btn {
                padding: 13px 26px;
                border-radius: 30px;
                font-weight: 600;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                text-decoration: none;
                color: #ffffff;
                background: rgba(255, 255, 255, 0.12);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            .hero-secondary-btn:hover {
                background: rgba(255, 255, 255, 0.25);
                color: #ffffff;
                transform: translateY(-2px);
            }

            .hero-trust-bar {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
                margin-top: 16px;
                padding: 16px 24px;
                background: #ffffff;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
                border: 1px solid rgba(229, 231, 235, 0.8);
            }
            @media (max-width: 768px) {
                .hero-trust-bar {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 14px;
                    padding: 14px;
                }
            }
            .trust-item {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .trust-icon {
                width: 42px;
                height: 42px;
                border-radius: 12px;
                background: #eef4ff;
                color: #0f62fe;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                flex-shrink: 0;
            }
            .trust-text strong {
                display: block;
                font-size: 0.85rem;
                color: #1e293b;
                font-weight: 700;
                line-height: 1.2;
            }
            .trust-text span {
                font-size: 0.75rem;
                color: #64748b;
            }
        `}</style>

        <div className="home-hero" style={{ width: '100%', height: '580px', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--line)' }}>
          {isMobile ? (
            <div className={`hero-lightfall-fallback ${theme === 'dark' ? 'hero-lightfall-fallback-dark' : ''}`} aria-hidden="true" />
          ) : (
            <Lightfall
              colors={lightfallColors}
              backgroundColor={theme === 'dark' ? '#090D16' : '#0A29FF'}
              dpr={1}
              speed={0.25}
              streakCount={8}
              streakWidth={1.2}
              streakLength={1}
              glow={1.2}
              density={1}
              twinkle={1}
              zoom={2.2}
              backgroundGlow={1}
              opacity={1}
              mouseInteraction={true}
              mouseStrength={1}
              mouseRadius={0.6}
            />
          )}
          <div className="carousel-caption-content" style={{ zIndex: 10, pointerEvents: 'auto' }}>
              <div className="hero-badge hero-badge-animated text-white" style={{ background: 'linear-gradient(135deg, #5227FF, #FF9FFC)', border: '1px solid rgba(255, 255, 255, 0.35)' }}>
                  <i className="bi bi-lightning-charge-fill"></i> Flagship Store 2026
              </div>
              <div className="my-3 hero-title-animated">
                <EchoText
                  text="ElectoMart - Your Tech Partner"
                  echoes={10}
                  lag={0.2}
                  offset={28}
                  direction="right"
                  fade={0.7}
                  blur={3}
                  tint="#7dd3fc"
                  mode="both"
                  cursorRadius={300}
                  duration={900}
                  ease="ease-out"
                  fontSize="clamp(1.75rem, 4.5vw, 3.5rem)"
                  fontWeight={800}
                  color="#ffffff"
                />
              </div>
              <p className="hero-desc hero-desc-animated d-none d-sm-block">Upgrade your digital lifestyle with high-speed smartphones, flagship workstations, and studio audio devices.</p>
              <div className="d-flex gap-3 flex-wrap hero-actions-animated">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/related" className="hero-primary-btn bg-white text-dark shadow-lg">
                          Shop Collection <i className="bi bi-arrow-right-short fs-5"></i>
                      </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <a href="#sale" className="hero-secondary-btn">
                          Explore Deals <i className="bi bi-fire text-warning"></i>
                      </a>
                  </motion.div>
              </div>
          </div>
        </div>

        {/* <div className="hero-trust-bar">
            {[
                { icon: "bi-shield-check", title: "100% Genuine", desc: "Official Warranty" },
                { icon: "bi-truck", title: "Express Delivery", desc: "Free on ₹999+" },
                { icon: "bi-arrow-repeat", title: "Easy 7-Day Return", desc: "Hassle-free policy" },
                { icon: "bi-credit-card-2-front", title: "Secure Payment", desc: "256-bit Encrypted" },
            ].map((item, idx) => (
                <motion.div 
                    key={idx} 
                    className="trust-item"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                >
                    <div className="trust-icon"><i className={`bi ${item.icon}`}></i></div>
                    <div className="trust-text">
                        <strong>{item.title}</strong>
                        <span>{item.desc}</span>
                    </div>
                </motion.div>
            ))}
        </div> */}
    </div>      
            <div className="container mt-5 position-relative py-3 rounded-4" style={{ overflow: 'hidden' }}>
                <CursorGrid
                    cellSize={50}
                    color={theme === "dark" ? "#818cf8" : "#0d6efd"}
                    radius={130}
                    falloff="smooth"
                    holdTime={400}
                    fadeDuration={700}
                    lineWidth={1}
                    maxOpacity={0.7}
                    fillOpacity={0.04}
                    gridOpacity={0.08}
                    cellRadius={2}
                    clickPulse={true}
                    pulseSpeed={500}
                />
                <motion.h2 
                    className="fw-bold text-center mb-4 section-title-modern position-relative"
                    style={{ zIndex: 2 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Product Categories
                </motion.h2>

                <div className="splide categorySlider mt-4 position-relative" style={{ zIndex: 2 }}>
                    <div className="splide__track">

                        <ul className="splide__list">

                            {d.map((a) => (
                                <li className="splide__slide" key={a._id}>

                                    <Link
                                        className="text-decoration-none w-100"
                                        to={`/related?id=${a._id}`}
                                    >
                                        <motion.div 
                                            className="card border-0 text-center p-3 w-100 category-card"
                                            whileHover={{ y: -8, scale: 1.04, boxShadow: "0 18px 35px rgba(0,0,0,0.12)" }}
                                            whileTap={{ scale: 0.96 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >

                                            <img
                                                className="img-fluid mx-auto mb-2"
                                                src={`/uploads/${a.Img}`}
                                                alt={a.Name}
                                                style={{ maxWidth: "120px" }}
                                            />

                                            <p className="fw-semibold text-dark mb-0">
                                                {a.Name}
                                            </p>

                                        </motion.div>
                                    </Link>

                                </li>
                            ))}

                        </ul>

                    </div>
                </div>

            </div>
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="cartCanvas">

                <div className="offcanvas-header">
                    <h5>Your Cart</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>

                <div className="offcanvas-body">


                    <button className="btn btn-dark w-50 mt-3">
                        Checkout
                    </button>

                </div>

            </div>
            <section className="container py-4 mt-2" data-aos="fade-up">
                <div className=" align-items-center  ">
                    <h2 className="fw-bold">Latest Products</h2>
                    <span className="text-muted small">New arrivals just for you</span>
                </div>

                <div className="row g-4 mt-2">
                    {lpro.map((p) => (
                        <div key={p._id} className="col-lg-3 col-md-4 col-sm-4 col-6">


                            <div className="card w-100 border-0 card-sm- shadow-sm text-center p-3" data-aos="fade-up">
                                <div className='cardicons justify-self-end'>

                                    <p className='text-danger btn' onClick={() => { wish(id, p.ProductName, p.ProductPrice, p.Img, p._id, p.SalePrice) }}><i class="bi bi-heart-fill"></i>
                                    </p>
                                    <p className='btn' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}><i class="bi bi-cart"></i></p>
                                    <p><i class="bi bi-eye"></i></p>
                                </div>
                                <div
                                    className=" rounded d-flex justify-content-center align-items-center mb-3"
                                    style={{ height: "150px" }}
                                >
                                    <img
                                        src={`${p.Img}`}
                                        alt={p.name}
                                        className="img-fluid rounded"
                                        style={{ height: "150px" }}
                                    />
                                </div>

                                <div className="card-body p-0">
                                    <h6 className="fs-6 fs-md-5 fs-lg-5 fw-semibold product-title">{p.ProductName}</h6>
                                    <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>

                                   <p className="d-flex justify-content-center align-self-center text-center">
                                        <span className=" ">
                                            ₹{p.ProductPrice}
                                        </span>
                                        <span className=" text-success fw-bold ms-1 ">
                                            ₹{p.SalePrice}
                                        </span>
                                        

                                    </p>

                                    <div className='d-flex flex-column flex-md-row gap-1'>
                                        <Link to={`/detail?id=${p._id}&cid=${p.Category} `} className="btn btn-primary btn-sm w-100 ">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-100 ' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}>Add to Cart</button>
                                    </div>
                                </div>

                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <section className="container  py-4 mt-2" data-aos="fade-up">
                <div className=" align-items-center mb-4 mt-2">
                    <h2 className="fw-bold">🔥 On Sale Products</h2>

                </div>

                <div className="row g-4">

                    {spro.map((p) => (
                        <div key={p._id} className="col-lg-3 col-6 col-md-4 col-sm-6">
                            <div className="card w-100 border-0 shadow-sm text-center p-3" data-aos="fade-up">
                                <div className="position-absolute top-0 start-0 h6">
                                    <span className="badge  bg-danger m-2">Off Upto:
                                        {calculateDiscount(p.ProductPrice, p.SalePrice)}%
                                    </span>
                                </div>
                                <div className='cardicons justify-self-end'>

                                    <p className='text-danger btn' onClick={() => { wish(id, p.ProductName, p.ProductPrice, p.Img, p._id, p.SalePrice) }}><i class="bi bi-heart-fill"></i>
                                    </p>
                                    <p className='btn' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity) }}><i class="bi bi-cart"></i></p>
                                    <p><i class="bi bi-eye"></i></p>
                                </div>
                                <div className=" rounded d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                    <img
                                        src={`${p.Img}`}
                                        alt={p.name}
                                        className="img-fluid"
                                        style={{ maxHeight: "120px" }}
                                    />
                                </div>

                                <div className="card-body p-0">
                                    <h6 className="fs-6 fs-md-5 fs-lg-5 fw-semibold product-title">{p.ProductName}</h6>
                                    <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>

                                     <p className="d-flex justify-content-center align-self-center text-center">
                                        <span className=" ">
                                            ₹{p.ProductPrice}
                                        </span>
                                        <span className=" text-success fw-bold ms-1 ">
                                            ₹{p.SalePrice}
                                        </span>
                                        

                                    </p>
                                    <div className='d-flex flex-column flex-md-row gap-1'>
                                        <Link to={`/detail?id=${p._id}&cid=${p.Category} `} className="btn btn-primary btn-sm w-100">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-100 ' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <section className="container  py-4 mt-2" data-aos="fade-up">
                <div className=" align-items-center mb-4 ">
                    <h2 className="fw-bold">🔥 Our Mobile Collection</h2>

                </div>

                <div className="row g-4">
                    {mobile.map((p) => (
                        <div key={p._id} className="col-lg-3 col-6 col-md-4 col-sm-6">

                            <div className="card w-100 border-0 shadow-sm text-center p-3" data-aos="fade-up">
                                <div className='cardicons justify-self-end'>

                                    <p className='text-danger btn' onClick={() => { wish(id, p.ProductName, p.ProductPrice, p.Img, p._id, p.SalePrice) }}><i class="bi bi-heart-fill"></i>
                                    </p>
                                    <p className='btn' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}><i class="bi bi-cart"></i></p>
                                    <p><i class="bi bi-eye"></i></p>
                                </div>
                                <div className=" rounded d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                    <img
                                        src={`${p.Img}`}
                                        alt={p.name}
                                        className="img-fluid"
                                        style={{ maxHeight: "120px" }}
                                    />
                                </div>

                                <div className="card-body p-0">
                                    <h6 className="fs-6 fs-md-5 fs-lg-5 fw-semibold product-title">{p.ProductName}</h6>
                                    <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>

                                    <p className="d-flex justify-content-center align-self-center text-center">
                                        <span className=" ">
                                            ₹{p.ProductPrice}
                                        </span>
                                        <span className=" text-success fw-bold ms-1 ">
                                            ₹{p.SalePrice}
                                        </span>
                                        

                                    </p>
                                    <div className='d-flex flex-column flex-md-row gap-1'>
                                        <Link to={`/detail?id=${p._id}&cid=${p.Category} `} className="btn btn-primary btn-sm w-100">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-100 ' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <section className="container py-4 mt-2" data-aos="fade-up">
                <div className=" align-items-center mb-4 ">
                    <h2 className="fw-bold">🔥 Our Laptop Collection</h2>

                </div>

                <div className="row g-4">
                    {laptop.map((p) => (
                        <div key={p._id} className="col-lg-3 col-6 col-md-4 col-sm-6">

                            <div className="card w-100 border-0 shadow-sm text-center p-3" data-aos="fade-up">
                                <div className='cardicons justify-self-end'>

                                    <p className='text-danger btn' onClick={() => { wish(id, p.ProductName, p.ProductPrice, p.Img, p._id, p.SalePrice) }}><i class="bi bi-heart-fill"></i>
                                    </p>
                                    <p className='btn' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}><i class="bi bi-cart"></i></p>
                                    <p><i class="bi bi-eye"></i></p>
                                </div>
                                <div className=" rounded d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                    <img
                                        src={`${p.Img}`}
                                        alt={p.name}
                                        className="img-fluid"
                                        style={{ maxHeight: "120px" }}
                                    />
                                </div>

                                <div className="card-body p-0">
                                    <h6 className="fs-6 fs-md-5 fs-lg-5 fw-semibold product-title">{p.ProductName}</h6>
                                    <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>
   <p className="d-flex justify-content-center align-self-center text-center">
                                        <span className=" ">
                                            ₹{p.ProductPrice}
                                        </span>
                                        <span className=" text-success fw-bold ms-1 ">
                                            ₹{p.SalePrice}
                                        </span>
                                        

                                    </p>
                                    <div className='d-flex flex-column flex-md-row gap-1'>
                                        <Link to={`/detail?id=${p._id}&cid=${p.Category} `} className="btn btn-primary btn-sm w-100">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-100 ' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <section className="container  py-4 mt-2" data-aos="fade-up">
                <div className=" align-items-center mb-4 ">
                    <h2 className="fw-bold">🔥 Our Airpods Collection</h2>

                </div>

                <div className="row g-4">
                    {airpod.map((p) => (
                        <div key={p._id} className="col-lg-3 col-6 col-md-4 col-sm-6">

                            <div className="card w-100 border-0 shadow-sm text-center p-3" data-aos="fade-up">
                                <div className='cardicons justify-self-end'>

                                    <p className='text-danger btn' onClick={() => { wish(id, p.ProductName, p.ProductPrice, p.Img, p._id, p.SalePrice) }}><i class="bi bi-heart-fill"></i>
                                    </p>
                                    <p className='btn' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}><i class="bi bi-cart"></i></p>
                                    <p><i class="bi bi-eye"></i></p>
                                </div>
                                <div className=" rounded d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                    <img
                                        src={`${p.Img}`}
                                        alt={p.name}
                                        className="img-fluid"
                                        style={{ maxHeight: "120px" }}
                                    />
                                </div>

                                <div className="card-body p-0">
                                    <h6 className="fs-6 fs-md-5 fs-lg-5 fw-semibold product-title">{p.ProductName}</h6>
                                    <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>

                                    <p className="d-flex justify-content-center align-self-center text-center">
                                        <span className=" ">
                                            ₹{p.ProductPrice}
                                        </span>
                                        <span className=" text-success fw-bold ms-1 ">
                                            ₹{p.SalePrice}
                                        </span>
                                        

                                    </p>
                                    <div className='d-flex flex-column flex-md-row gap-1'>
                                        <Link to={`/detail?id=${p._id}&cid=${p.Category} `} className="btn btn-primary btn-sm w-100">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-100 ' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <section className="container  py-4 mt-2" data-aos="fade-up" >
                <div className=" align-items-center mb-4 ">
                    <h2 className="fw-bold">🔥 Our Led Collection</h2>

                </div>

                <div className="row g-4">
                    {led.map((p) => (
                        <div key={p._id} className="col-lg-3 col-6 col-md-4 col-sm-6">

                            <div className="card w-100 border-0 shadow-sm text-center p-3" data-aos="fade-up">
                                <div className='cardicons justify-self-end'>

                                    <p className='text-danger btn' onClick={() => { wish(id, p.ProductName, p.ProductPrice, p.Img, p._id, p.SalePrice) }}><i class="bi bi-heart-fill"></i>
                                    </p>
                                    <p className='btn' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}><i class="bi bi-cart"></i></p>
                                    <p><i class="bi bi-eye"></i></p>
                                </div>
                                <div className=" rounded d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                    <img
                                        src={`${p.Img}`}
                                        alt={p.name}
                                        className="img-fluid"
                                        style={{ maxHeight: "120px" }}
                                    />
                                </div>

                                <div className="card-body p-0">
                                    <h6 className="fs-6 fs-md-5 fs-lg-5 fw-semibold product-title">{p.ProductName}</h6>
                                    <div className="mb-2 text-warning">
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-fill"></i>
    <i className="bi bi-star-half"></i>
    <i className="bi bi-star"></i>
    <span className="text-muted small ms-1">(4.3)</span>
</div>

                                   <p className="d-flex justify-content-center align-self-center text-center">
                                        <span className=" ">
                                            ₹{p.ProductPrice}
                                        </span>
                                        <span className=" text-success fw-bold ms-1 ">
                                            ₹{p.SalePrice}
                                        </span>
                                        

                                    </p>
                                    <div className='d-flex flex-column flex-md-row gap-1'>
                                        <Link to={`/detail?id=${p._id}&cid=${p.Category} `} className="btn btn-primary btn-sm w-100">
                                            View Product
                                        </Link>
                                        <button className='btn btn-danger btn-sm w-100 ' onClick={() => { cart(id, p.ProductName, p.ProductPrice, p.Img, p.Quantity, p._id) }}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <section className="container mt-2 py-4">
                <motion.h2 
                    className="fw-bold text-center mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Why Choose Us
                </motion.h2>
                <div className="row g-4 py-5">
                    {[
                        { icon: "bi-truck", color: "text-primary", title: "Free Shipping", desc: "On orders above ₹999" },
                        { icon: "bi-shield-check", color: "text-success", title: "Secure Payment", desc: "100% secure transactions" },
                        { icon: "bi-arrow-repeat", color: "text-warning", title: "Easy Returns", desc: "7 days return policy" },
                        { icon: "bi-headset", color: "text-info", title: "24/7 Support", desc: "Dedicated customer support" },
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx} 
                            className="col-md-3 col-6 text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            whileHover={{ y: -6 }}
                        >
                            <motion.i 
                                className={`bi ${item.icon} fs-1 ${item.color} d-inline-block`}
                                whileHover={{ rotate: [0, -12, 12, -6, 0], scale: 1.25 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            ></motion.i>
                            <h6 className="mt-2 fw-bold">{item.title}</h6>
                            <small className="text-muted">{item.desc}</small>
                        </motion.div>
                    ))}
                </div>
            </section>
            <section className="bg-light py-5 mt-5">
                <div className="container">
                    <motion.h2 
                        className="fw-bold text-center mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        What Our Customers Say
                    </motion.h2>
                    <div className="row">
                        {[
                            { quote: "Amazing products and fast delivery!", author: "- John Doe", stars: 5 },
                            { quote: "Great quality and excellent customer support.", author: "- Sarah Williams", stars: 4.5 },
                            { quote: "Very satisfied with my purchase. Highly recommended!", author: "- Michael Brown", stars: 5 },
                        ].map((review, idx) => (
                            <motion.div 
                                key={idx} 
                                className="col-md-4 mb-3"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.12 }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="card w-100 h-100 border-0 shadow-sm rounded-4 p-2">
                                    <div className="card-body text-center">
                                        <div className="mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className={`bi ${i < Math.floor(review.stars) ? 'bi-star-fill' : 'bi-star-half'} text-warning me-1`}></i>
                                            ))}
                                        </div>
                                        <p className="mt-3 text-muted fst-italic">"{review.quote}"</p>
                                        <h6 className="fw-bold text-dark">{review.author}</h6>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <section>
                <div className="container mt-3" >
                    <h2>Trusted By</h2>

                    <div className="marquee py-5">
                        <div className="marquee-content gap-5">
                            {br.concat(br).map((a, index) => (
                                <img key={index} className='rounded-4 object-fit-cover' src={`/uploads/${a.Img}`} height="100px" alt="brand" />
                            ))}
                        </div>
                    </div>


                </div>
            </section>

            {showTop && (
                <button
                    id='goTopBtn'
                    type="button"
                    onClick={gotop}
                    style={{ "--scroll-progress": `${Math.min(scrollProgress, 100) * 3.6}deg` }}
                    aria-label="Go to top"
                >
                    <span className="go-top-icon" aria-hidden="true">
                        <i className="bi bi-arrow-up"></i>
                    </span>
                </button>
            )}
        </>
    )
};
