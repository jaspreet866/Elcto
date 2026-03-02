import { useState } from "react"
import img1 from "./images/img_01.jpg"
import img2 from "./images/contact.jpg"
 
export const Contact = () => {
    const [name, setname] = useState("")
    const [mail, setmail] = useState("")
    const [phn, setphn] = useState(0)
    const [type, settype] = useState("")
    const [msg, setmsg] = useState("")

    const send = async () => {
        const data = { name, mail, phn, type, msg }
        const result = await fetch("https://elcto-1.onrender.com/api/response", {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                alert("ok")
            }
            else {
                alert("dfg")
            }
        }
    }



    return (
        <>
            <section className="s-page-title d-flex align-items-center justify-content-center text-center">
                <div className="container-fluid bread">
                    <div className="content">
                        <h1 className="title-page">Contact</h1>

                        <ul className="breadcrumbs-page list-unstyled d-flex justify-content-center align-items-center gap-2 py-3">
                            <li>
                                <a href="/" className="h6 link text-decoration-none">
                                    Home
                                </a>
                            </li>
                            <li>
                                <span>{">"}</span>
                            </li>
                            <li>
                                <h6 className="current-page fw-normal mb-0">
                                    Contact
                                </h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-lg-7 col-6  text-start px-5">
                            <h1 className="fw-bolder fs-1">Our Store</h1>
                            <p className="fs-4"><strong className="fw-bolder fs-3">Address:</strong>342 East American Street, New York, USA - 1212</p>
                            <p className="fs-4"><strong className="fw-bolder fs-3">Phone:</strong> +1 (817) 234 - 234</p>
                            <p className="fs-4"><strong className="fw-bolder fs-3">Email:</strong>electromart@gmail.com</p>
                            <p className="fs-4 d-flex gap-5 align-items-center"><strong className="fw-bolder fs-3">Social Media:</strong><i class="bi bi-instagram"></i><i class="bi bi-facebook"></i><i class="bi bi-messenger"></i><i class="bi bi-twitter-x"></i></p>
                        </div>
                        <div className="col">
                            <img width="450px" src={img2}></img>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mt-2">
                <div class="wg-map d-flex py-5">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7880.148272329334!2d151.20657421407668!3d-33.858885268389294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae682c546039%3A0x16da940d587922a1!2sCircular%20Quay!5e0!3m2!1sen!2s!4v1745205798630!5m2!1sen!2s" width="100%" height="461" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </section>
            <section>
                <div className="container">
                    <div className="row  g-5">
                        <div className="col-lg-5 py-5">
                            <img src={img1}></img>
                        </div>
                        <div className="col py-5">
                            <div className="card w-100 border-0 mt-2  ">
                                <div className="d-flex gap-5 contact">
                                    <input className="form-control w-75 " placeholder="Enter your Name" onChange={(e) => setname(e.target.value)}></input>
                                    <input className="form-control w-75" placeholder="Enter your Email" onChange={(e) => setmail(e.target.value)}></input>
                                </div>
                                <div className="d-flex gap-5 contact">
                                    <input className="form-control w-75" placeholder="Enter your Mobile" onChange={(e) => setphn(e.target.value)}></input>
                                    <select className="form-select w-75" onChange={(e) => settype(e.target.value)} >
                                        <option>Select Your Opinion</option>
                                        <option>Complaint</option>
                                        <option>Query</option>
                                        <option>Information</option>
                                    </select>
                                </div>
                                <textarea className="form-control txt " onChange={(e) => setmsg(e.target.value)}> </textarea>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="checkDefault" />

                                    <p className="text-start">Save my Information,For Next Time</p>
                                </div>
                                <button className="btn btn-primary w-25" onClick={send}>Send   <i className="bi bi-arrow-right "></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}