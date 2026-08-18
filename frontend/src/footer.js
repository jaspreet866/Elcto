import card1 from './images/amex.png'
import card2 from './images/paypal.png'
import card3 from './images/master-card.png'
import card4 from './images/visa.png'
import card5 from './images/discover.png'
import logo from "./images/WhatsApp Image 2026-02-12 at 11.08.16 AM.png"
import { motion } from 'framer-motion'

export const Footer = () => {
    return (
        <>
            <motion.footer 
                className="bg-light mt-5 pt-5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <hr />

                <div className="container">
                  
                    <div className="row gy-4">
                        <div className="col-lg-3 col-6 col-md-6">
                           <motion.img 
                                height="70px" 
                                src={logo}
                                alt="Electo Logo"
                                whileHover={{ scale: 1.05 }}
                           />
                            <p className="text-muted mt-2">
                                We are here to serve you
                            </p>
                        </div>

                        {/* PRODUCTS */}
                        <div className="col-lg-3 col-6 col-md-6">
                            <h5 className="fw-semibold mb-3">Products</h5>
                            <ul className="list-unstyled text-muted">
                                {["MOBILES", "LEDs", "LAPTOPS", "CAMERAS"].map((item, i) => (
                                    <motion.li key={i} whileHover={{ x: 6, color: "#0d6efd" }} transition={{ duration: 0.2 }}>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* FEATURES */}
                        <div className="col-lg-3 col-6 col-md-6">
                            <h5 className="fw-semibold mb-3">Features</h5>
                            <ul className="list-unstyled text-muted">
                                {["About Us", "Contact Us", "Order", "Terms & Conditions"].map((item, i) => (
                                    <motion.li key={i} whileHover={{ x: 6, color: "#0d6efd" }} transition={{ duration: 0.2 }}>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* HELP */}
                        <div className="col-lg-3 col-6 col-md-6">
                            <h5 className="fw-semibold mb-2">
                                We are here to help you
                            </h5>
                            <p className="text-muted">
                                If any problem, email us
                            </p>

                            <input
                                type="email"
                                className="form-control mb-2"
                                placeholder="Your email"
                            />
                            <motion.button 
                                className="btn btn-primary w-100 fw-bold"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                            >
                                Send <i className="bi bi-send ms-1"></i>
                            </motion.button>
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div className="row align-items-center gy-3 pb-4">
                        <div className="col-md-4 text-center text-md-start">
                            <p className="mb-0 text-muted">
                                &copy; ElectoMart 2026. All Rights Reserved
                            </p>
                        </div>

                        <div className="col-md-4 text-center">
                            <div className="footer-social-links d-flex justify-content-center gap-3">
                                <motion.a 
                                    href="https://facebook.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="footer-social-icon social-facebook"
                                    aria-label="Facebook"
                                    whileHover={{ y: -5, scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <i className="bi bi-facebook"></i>
                                </motion.a>

                                <motion.a 
                                    href="https://instagram.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="footer-social-icon social-instagram"
                                    aria-label="Instagram"
                                    whileHover={{ y: -5, scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <i className="bi bi-instagram"></i>
                                </motion.a>

                                <motion.a 
                                    href="https://twitter.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="footer-social-icon social-x"
                                    aria-label="Twitter X"
                                    whileHover={{ y: -5, scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <i className="bi bi-twitter-x"></i>
                                </motion.a>

                                <motion.a 
                                    href="https://linkedin.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="footer-social-icon social-linkedin"
                                    aria-label="LinkedIn"
                                    whileHover={{ y: -5, scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <i className="bi bi-linkedin"></i>
                                </motion.a>
                            </div>
                        </div>

                        <div className="col-md-4 text-center text-md-end">
                            <div className="d-flex justify-content-center justify-content-md-end gap-2">
                                {[card1, card2, card3, card4, card5].map((cardImg, idx) => (
                                    <motion.img 
                                        key={idx} 
                                        src={cardImg} 
                                        width="50" 
                                        alt="payment card"
                                        whileHover={{ y: -4, scale: 1.1 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.footer>
        </>
    )
}
