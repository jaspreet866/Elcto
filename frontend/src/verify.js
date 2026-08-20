import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE } from "./apiConfig";

export const Verifyy = () => {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailFromUrl = params.get("email");
        const savedEmail = emailFromUrl || localStorage.getItem("email") || "";
        setEmail(savedEmail);
        if (emailFromUrl) {
            localStorage.setItem("email", emailFromUrl);
        }
    }, []);

    const verify = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const cleanOtp = otp.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {
            setErrorMessage("Email address is missing. Please restart password recovery.");
            return;
        }

        if (!cleanOtp) {
            setErrorMessage("Please enter the 6-digit OTP code sent to your email.");
            return;
        }

        setLoading(true);
        try {
            const result = await fetch(`${API_BASE}/api/verify-otp`, {
                method: "POST",
                body: JSON.stringify({ email: cleanEmail, otp: cleanOtp }),
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            });

            const res = await result.json();
            if (res.statuscode === 1) {
                await Swal.fire({
                    icon: "success",
                    title: "OTP Verified!",
                    text: "Identity confirmed. Please choose your new password.",
                    confirmButtonColor: "#2563eb",
                    timer: 2000
                });
                navigate(`/resetpassword?email=${encodeURIComponent(cleanEmail)}`);
            } else {
                setErrorMessage(res.message || "Invalid OTP code. Please check and try again.");
                Swal.fire({
                    icon: "error",
                    title: "Verification Failed",
                    text: res.message || "The code entered does not match.",
                    confirmButtonColor: "#2563eb"
                });
            }
        } catch (err) {
            console.error("OTP verification error:", err);
            setErrorMessage("Server error during verification. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail) {
            Swal.fire({
                icon: "warning",
                title: "Email Required",
                text: "Please enter your email to receive an OTP."
            });
            return;
        }

        setResending(true);
        try {
            const response = await fetch(`${API_BASE}/api/forgot`, {
                method: "POST",
                body: JSON.stringify({ email: cleanEmail }),
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            });
            const res = await response.json();
            if (res.statuscode === 1) {
                Swal.fire({
                    icon: "success",
                    title: "New OTP Sent",
                    text: res.message || "A fresh OTP code has been sent to your email.",
                    confirmButtonColor: "#2563eb"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to resend",
                    text: res.message || "Could not generate a new OTP."
                });
            }
        } catch (err) {
            console.error("Resend OTP error:", err);
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: "Failed to connect to the server."
            });
        } finally {
            setResending(false);
        }
    };

    return (
        <main className="account-page">
            <section className="account-showcase verify-showcase">
                <Link to="/forgot" className="account-back">
                    <i className="bi bi-arrow-left"></i> Change Email
                </Link>
                <div className="account-showcase-content">
                    <span className="vendor-eyebrow">
                        <i className="bi bi-key"></i> One-Time Verification
                    </span>
                    <h1>Check your<br />inbox.</h1>
                    <p>We've sent a 6-digit one-time passcode to your email. Enter it to verify your ownership of this account.</p>
                    <div className="account-showcase-points">
                        <span><i className="bi bi-shield-check"></i> Encrypted transmission</span>
                        <span><i className="bi bi-hourglass-split"></i> 10-minute code expiry</span>
                        <span><i className="bi bi-arrow-repeat"></i> Resend anytime if needed</span>
                    </div>
                </div>
            </section>

            <section className="account-panel">
                <div className="account-card">
                    <Link to="/forgot" className="account-mobile-back">
                        <i className="bi bi-arrow-left"></i> Change Email
                    </Link>
                    <span className="vendor-eyebrow vendor-eyebrow-dark">Step 2 of 3</span>
                    <h2>Verify your OTP</h2>
                    <p className="account-subtitle">
                        Sent to: <strong>{email || "your registered email"}</strong>
                    </p>

                    <form onSubmit={verify} className="account-form">
                        {!email && (
                            <label className="vendor-field">
                                <span>Email Address</span>
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>
                        )}

                        <label className="vendor-field">
                            <span>6-Digit OTP Code</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="6"
                                required
                                placeholder="• • • • • •"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                style={{ letterSpacing: "8px", fontSize: "1.3rem", fontWeight: "700", textAlign: "center" }}
                                autoFocus
                                disabled={loading}
                            />
                        </label>

                        {errorMessage && (
                            <p className="account-error" role="alert">
                                <i className="bi bi-exclamation-circle me-1"></i> {errorMessage}
                            </p>
                        )}

                        <button className="vendor-primary-btn" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Verifying OTP...
                                </>
                            ) : (
                                <>
                                    Verify Code <i className="bi bi-arrow-right"></i>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-none"
                            style={{ fontSize: "0.82rem", fontWeight: "700", color: "#2563eb" }}
                            onClick={resendOtp}
                            disabled={resending}
                        >
                            {resending ? "Sending fresh OTP..." : "Didn't get code? Resend OTP"}
                        </button>
                        <Link to="/forgot" style={{ fontSize: "0.82rem", color: "#64748b", textDecoration: "none" }}>
                            Change email
                        </Link>
                    </div>

                    <p className="account-switch">
                        Remember your password? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
};
