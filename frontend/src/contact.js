import { useState } from "react";
import img1 from "./images/img_01.jpg";
import img2 from "./images/contact.jpg";
import { SEO } from "./SEO";

const initialForm = { name: "", mail: "", phn: "", type: "", msg: "", saveInfo: false };

export const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const send = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const result = await fetch("https://elcto-1.onrender.com/api/response", {
        method: "POST",
        body: JSON.stringify({ name: form.name, mail: form.mail, phn: form.phn, type: form.type, msg: form.msg }),
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      });
      const response = await result.json();

      if (!result.ok || response.statuscode !== 1) throw new Error("Unable to send message");

      setStatus("success");
      setMessage("Thanks — your message is on its way. We’ll get back to you shortly.");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setMessage("We couldn’t send your message right now. Please try again shortly.");
    }
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact ElectoMart Customer Support",
    "description": "Contact ElectoMart for queries, order status, warranty claims, and tech support.",
    "url": typeof window !== 'undefined' ? window.location.href : "https://electomart.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "ElectoMart",
      "telephone": "+91-XXXXXXXXXX",
      "contactType": "Customer Support",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  return (
    <main className="contact-page">
      <SEO
        title="Contact Us - Customer Support & Assistance"
        description="Get in touch with ElectoMart customer support for inquiries, order tracking, returns, and expert tech advice."
        keywords="contact ElectoMart, customer support, electronics help desk, order inquiry, support team"
        schema={contactSchema}
      />
      <section className="s-page-title d-flex align-items-center justify-content-center text-center">
        <div className="container-fluid bread">
          <div className="content">
            <h1 className="title-page">Contact</h1>
            <ul className="breadcrumbs-page list-unstyled d-flex justify-content-center align-items-center gap-2 py-3">
              <li><a href="/" className="h6 link text-decoration-none">Home</a></li>
              <li><span aria-hidden="true">&gt;</span></li>
              <li><h6 className="current-page fw-normal mb-0">Contact</h6></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="contact-intro container">
        <div className="contact-store-card">
          <div className="contact-store-copy">
            <p className="contact-eyebrow">We’re here to help</p>
            <h2 className="text-white">Let’s make tech feel simple.</h2>
            <p className="contact-lead">Whether you need product advice, order help, or have an idea to share, our team would love to hear from you.</p>
            <div className="contact-details">
              <a href="https://maps.google.com/?q=342+East+American+Street+New+York+USA+1212" target="_blank" rel="noreferrer"><i className="bi bi-geo-alt" aria-hidden="true" /><span><strong>Visit us</strong>342 East American Street, New York, USA 1212</span></a>
              <a href="tel:+1817234234"><i className="bi bi-telephone" aria-hidden="true" /><span><strong>Call us</strong>+1 (817) 234-234</span></a>
              <a href="mailto:electromart@gmail.com"><i className="bi bi-envelope" aria-hidden="true" /><span><strong>Email us</strong>electromart@gmail.com</span></a>
            </div>
            <div className="contact-socials" aria-label="Social media links">
              <a href="https://instagram.com" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              <a href="https://facebook.com" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              <a href="https://x.com" aria-label="X"><i className="bi bi-twitter-x" /></a>
            </div>
          </div>
          <div className="contact-store-image"><img src={img2} alt="Electronics displayed in our store" /></div>
        </div>
      </section>

      <section className="container contact-map-wrap">
        <iframe title="Our store location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7880.148272329334!2d151.20657421407668!3d-33.858885268389294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae682c546039%3A0x16da940d587922a1!2sCircular%20Quay!5e0!3m2!1sen!2s!4v1745205798630!5m2!1sen!2s" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </section>

      <section className="container contact-form-section">
        <div className="contact-form-visual"><img src={img1} alt="Customer support specialist ready to help" /></div>
        <div className="contact-form-card">
          <p className="contact-eyebrow">Send a message</p>
          <h2>How can we help?</h2>
          <p className="contact-form-intro">Complete the form below and we’ll respond within one business day.</p>
          <form onSubmit={send}>
            <div className="contact-fields">
              <label><span>Full name</span><input name="name" value={form.name} onChange={updateField} placeholder="Your name" autoComplete="name" required /></label>
              <label><span>Email address</span><input name="mail" type="email" value={form.mail} onChange={updateField} placeholder="you@example.com" autoComplete="email" required /></label>
              <label><span>Phone number <em>Optional</em></span><input name="phn" type="tel" value={form.phn} onChange={updateField} placeholder="+1 (000) 000-0000" autoComplete="tel" /></label>
              <label><span>What is this about?</span><select name="type" value={form.type} onChange={updateField} required><option value="" disabled>Select a topic</option><option>Complaint</option><option>Query</option><option>Product information</option><option>Order support</option></select></label>
              <label className="contact-message"><span>Your message</span><textarea name="msg" value={form.msg} onChange={updateField} placeholder="Tell us how we can help..." required /></label>
            </div>
            <label className="contact-save"><input name="saveInfo" type="checkbox" checked={form.saveInfo} onChange={updateField} /> <span>Save my details for next time.</span></label>
            {message && <div className={`contact-status ${status}`} role="status"><i className={`bi ${status === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"}`} /> {message}</div>}
            <button className="contact-send" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : <>Send message <i className="bi bi-arrow-up-right" /></>}</button>
          </form>
        </div>
      </section>
    </main>
  );
};
