import card1 from './images/amex.png'
import card2 from './images/paypal.png'
import card3 from './images/master-card.png'
import card4 from './images/visa.png'
import card5 from './images/discover.png'
import logo from "./images/WhatsApp Image 2026-02-12 at 11.08.16 AM.png"



export const Footer = () => {
    return (
        <>
            <footer className="bg-light mt-5 pt-5">
                <hr />

                <div className="container">
                  
                    <div className="row gy-4">

                    
                        <div className="col-lg-3 col-6 col-md-6">
                           <img height="70px" src={logo}></img>
                            <p className="text-muted">
                                We are here to serve you
                            </p>
                        </div>

                        {/* PRODUCTS */}
                        <div className="col-lg-3 col-6 col-md-6">
                            <h5 className="fw-semibold mb-3">Products</h5>
                            <ul className="list-unstyled text-muted">
                                <li>MOBILES</li>
                                <li>LEDs</li>
                                <li>LAPTOPS</li>
                                <li>CAMERAS</li>
                            </ul>
                        </div>

                        {/* FEATURES */}
                        <div className="col-lg-3 col-6 col-md-6">
                            <h5 className="fw-semibold mb-3">Features</h5>
                            <ul className="list-unstyled text-muted">
                                <li>About Us</li>
                                <li>Contact Us</li>
                                <li>Order</li>
                                <li>Terms & Conditions</li>
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
                            <button className="btn btn-primary w-100">
                                Send
                            </button>
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div className="row align-items-center gy-3">

                        
                        <div className="col-md-4 text-center text-md-start">
                            <p className="mb-0 text-muted">
                                &copy; ElectoMart 2025. All Rights Reserved
                            </p>
                        </div>

                       
                        <div className="col-md-4 text-center">
                            <div className="d-flex justify-content-center gap-3 fs-5">
                                <i className="fa-brands fa-facebook"></i>
                                <i className="fa-brands fa-instagram"></i>
                                <i className="fa-brands fa-x-twitter"></i>
                            </div>
                        </div>

                    
                        <div className="col-md-4 text-center text-md-end">
                            <div className="d-flex justify-content-center justify-content-md-end gap-2">
                                <img src={card1} width="50" />
                                <img src={card2} width="50" />
                                <img src={card3} width="50" />
                                <img src={card4} width="50" />
                                <img src={card5} width="50" />
                            </div>
                        </div>

                    </div>
                </div>
            </footer>
        </>
    )
}
