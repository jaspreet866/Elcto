import { Link } from "react-router-dom"
import img1 from "./images/ChatGPT Image Feb 11, 2026, 07_41_57 PM.png"
import logo from "./images/WhatsApp Image 2026-02-12 at 11.08.16 AM.png"
import m1 from "./images/download.jpeg"
import m2 from "./images/download (1).jpeg"
import m3 from "./images/download (2).jpeg"     
import { useEffect, useState } from "react"

import AOS from "aos"
import "aos/dist/aos.css"
import CountUp from "react-countup"

export const About = () => {

    const [d, setd] = useState([])
    const [loading, setLoading] = useState(true)

    // Team members data
    const teamMembers = [
        { id: 1, name: "John Doe", role: "Founder & CEO", image: "team1.jpg" },
        { id: 2, name: "Jane Smith", role: "Head of Operations", image: "team2.jpg" },
        { id: 3, name: "Mike Johnson", role: "Customer Support Lead", image: "team3.jpg" }
    ]

    // Testimonials data
    const testimonials = [
        { id: 1, name: "Rajesh K.", review: "Great products and amazing customer service. Highly recommended!", rating: 5 },
        { id: 2, name: "Priya S.", review: "Fast delivery and genuine products. Will shop again!", rating: 5 },
        { id: 3, name: "Amit M.", review: "Best electronics store in town. Competitive prices!", rating: 4 }
    ]

    // FAQ data
    const faqs = [
        { id: 1, question: "What is your return policy?", answer: "We offer 30-day hassle-free returns on all products." },
        { id: 2, question: "Do you provide warranty?", answer: "Yes, all products come with minimum 1 year warranty." },
        { id: 3, question: "How long does delivery take?", answer: "Delivery takes 3-5 business days within India." }
    ]

    // Partner brands
    const partnerBrands = [
        "brand1.png", "brand2.png", "brand3.png", "brand4.png", "brand5.png", "brand6.png"
    ]

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true
        })
        show()
    }, [])

    const show = async () => {
        const result = await fetch("https://elcto-1.onrender.com/api/showbrand")

        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) setd(res.data)
        }

        setLoading(false)
    }

    if (loading) return <p className="text-center mt-5">Loading...</p>

    return (
        <>

            {/* Logo */}
            <div className="container mt-4">
                <Link to="/" className="navbar-brand">
                    <img src={logo} style={{ height: "45px" }} alt="logo" />
                </Link>
            </div>

            {/* About */}
            <section className="py-5">
                <div className="container">

                    <div className="text-center mb-5" data-aos="fade-up">
                        <h2>About Our Store</h2>
                        <p className="text-muted">Smart electronics. Honest prices. Reliable service.</p>
                    </div>

                    <div className="row align-items-center">

                        <div className="col-md-6 mb-4" data-aos="fade-right">
                            <img src={img1} className="img-fluid rounded shadow" alt="about" />
                        </div>

                        <div className="col-md-6" data-aos="fade-left">

                            <h4>Your One-Stop Electronics Shop</h4>

                            <p>
                                We provide the latest gadgets and accessories at affordable prices.
                                From LED TVs and security cameras to smartphones and laptops.
                            </p>

                            <div className="row mt-3">
                                <div className="col-6">✅ Genuine Products</div>
                                <div className="col-6">🚚 Fast Delivery</div>
                                <div className="col-6 mt-2">💳 Secure Payments</div>
                                <div className="col-6 mt-2">📞 Customer Support</div>
                            </div>

                            {/* Counters */}
                            <div className="row text-center mt-4">

                                <div className="col-4">
                                    <h3><CountUp end={500} duration={2} />+</h3>
                                    <small>Products</small>
                                </div>

                                <div className="col-4">
                                    <h3><CountUp end={2000} duration={2} />+</h3>
                                    <small>Customers</small>
                                </div>

                                <div className="col-4">
                                    <h3><CountUp end={4.8} decimals={1} duration={2} />★</h3>
                                    <small>Rating</small>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-5 bg-light">
                <div className="container">
                    <h2 className="text-center mb-5" data-aos="fade-up">Why Choose Us</h2>
                    <div className="row">
                        <div className="col-md-3 text-center mb-4" data-aos="fade-up" data-aos-delay="100">
                            <i className="bi bi-truck fs-1 text-primary"></i>
                            <h5 className="mt-3">Free Shipping</h5>
                            <p className="text-muted">On orders above ₹999</p>
                        </div>
                        <div className="col-md-3 text-center mb-4" data-aos="fade-up" data-aos-delay="200">
                            <i className="bi bi-shield-check fs-1 text-primary"></i>
                            <h5 className="mt-3">2 Year Warranty</h5>
                            <p className="text-muted">On all products</p>
                        </div>
                        <div className="col-md-3 text-center mb-4" data-aos="fade-up" data-aos-delay="300">
                            <i className="bi bi-arrow-repeat fs-1 text-primary"></i>
                            <h5 className="mt-3">30-Day Returns</h5>
                            <p className="text-muted">Hassle-free returns</p>
                        </div>
                        <div className="col-md-3 text-center mb-4" data-aos="fade-up" data-aos-delay="400">
                            <i className="bi bi-headset fs-1 text-primary"></i>
                            <h5 className="mt-3">24/7 Support</h5>
                            <p className="text-muted">Always here to help</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story / Timeline */}
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center mb-5" data-aos="fade-up">Our Journey</h2>
                    <div className="row">
                        <div className="col-md-3 text-center" data-aos="fade-right">
                            <div className="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                                <h3 className="mb-0">2020</h3>
                            </div>
                            <h5 className="mt-3">Founded</h5>
                            <p className="text-muted">Started with a small team of 3</p>
                        </div>
                        <div className="col-md-3 text-center" data-aos="fade-right" data-aos-delay="100">
                            <div className="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                                <h3 className="mb-0">2022</h3>
                            </div>
                            <h5 className="mt-3">10K+ Customers</h5>
                            <p className="text-muted">Reached milestone</p>
                        </div>
                        <div className="col-md-3 text-center" data-aos="fade-right" data-aos-delay="200">
                            <div className="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                                <h3 className="mb-0">2024</h3>
                            </div>
                            <h5 className="mt-3">Pan America</h5>
                            <p className="text-muted">Delivery across America</p>
                        </div>
                        <div className="col-md-3 text-center" data-aos="fade-right" data-aos-delay="300">
                            <div className="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                                <h3 className="mb-0">2026</h3>
                            </div>
                            <h5 className="mt-3">50K+ Products</h5>
                            <p className="text-muted">Wide range collection</p>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-5 bg-light">
                <div className="container">
                    <h2 className="text-center mb-5" data-aos="fade-up">Meet Our Team</h2>
                    <div className="row">

                        <div className="col-md-4 mb-4" data-aos="fade-up" >
                            <div className="card team-card w-100 border-0 shadow-sm">
                                <img src={m1} className="card-img-top rounded-circle mx-auto mt-4" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                <div className="card-body text-center">
                                    <h5>Harry Buttler</h5>
                                    <p className="text-primary">CEO</p>
                                    <div className="social-links">
                                        <i className="bi bi-linkedin me-2"></i>
                                        <i className="bi bi-twitter me-2"></i>
                                        <i className="bi bi-envelope"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" data-aos="fade-up" >
                            <div className="card team-card w-100 border-0 shadow-sm">
                                <img src={m2} className="card-img-top rounded-circle mx-auto mt-4" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                <div className="card-body text-center">
                                    <h5>Jane Smith</h5>
                                    <p className="text-primary">Founder</p>
                                    <div className="social-links">
                                        <i className="bi bi-linkedin me-2"></i>
                                        <i className="bi bi-twitter me-2"></i>
                                        <i className="bi bi-envelope"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" data-aos="fade-up" >
                            <div className="card team-card w-100 border-0 shadow-sm">
                                <img src={m3} className="card-img-top rounded-circle mx-auto mt-4" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                <div className="card-body text-center">
                                    <h5>Aden Joseph</h5>
                                    <p className="text-primary">Lead Developer</p>
                                    <div className="social-links">
                                        <i className="bi bi-linkedin me-2"></i>
                                        <i className="bi bi-twitter me-2"></i>
                                        <i className="bi bi-envelope"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Customer Testimonials */}
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center mb-5" data-aos="fade-up">What Our Customers Say</h2>
                    <div className="row">
                        {testimonials.map((test, index) => (
                            <div className="col-md-4 mb-4" key={test.id} data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className="card w-100 border-0 shadow-sm">
                                    <div className="card-body p-4">
                                        <div className="text-warning mb-3">
                                            {[...Array(test.rating)].map((_, i) => (
                                                <i key={i} className="bi bi-star-fill me-1"></i>
                                            ))}
                                        </div>
                                        <p className="card-text fst-italic">"{test.review}"</p>
                                        <footer className="blockquote-footer mt-3">{test.name}</footer>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            <section>
                <div className="container mt-5">
                    <h2>Trusted By</h2>
                    <div className="marquee py-5">
                        <div className="marquee-content gap-5">
                            {d.concat(d).map((a, index) => (
                                <img key={index} className='rounded-4 object-fit-cover' src={`/uploads/${a.Img}`} height="100px" alt="brand" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-4 text-center bg-dark text-white">
                <h4>Ready to upgrade your tech?</h4>
                <Link to="/" className="btn btn-light mt-3">Start Shopping</Link>
            </section>

            {/* Add CSS for animations */}
            <style jsx>{`
                .grayscale {
                    filter: grayscale(100%);
                }
                .grayscale:hover {
                    filter: grayscale(0%);
                }
                .hover-effect:hover {
                    opacity: 1 !important;
                    transform: scale(1.1);
                }
                .team-card {
                    transition: transform 0.3s;
                }
                .team-card:hover {
                    transform: translateY(-10px);
                }
            `}</style>

        </>
    )
}