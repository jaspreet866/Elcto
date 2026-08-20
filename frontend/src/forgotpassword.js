import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE } from "./apiConfig";

export const ForgetPass = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const sendLink = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail) {
            setErrorMessage("Please enter your registered email address.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/forgot`, {
                method: "POST",
                body: JSON.stringify({ email: cleanEmail }),
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            });

            const res = await response.json();
            if (res.statuscode === 1) {
                localStorage.setItem("email", cleanEmail);
                await Swal.fire({
                    icon: "success",
                    title: "OTP Generated",
                    text: res.message || "We have generated an OTP for your account.",
                    confirmButtonColor: "#2563eb"
                });
                navigate(`/verify?email=${encodeURIComponent(cleanEmail)}`);
            } else {
                setErrorMessage(res.message || "Failed to process request. Please try again.");
                Swal.fire({
                    icon: "error",
                    title: "Unable to send OTP",
                    text: res.message || "No account found with this email.",
                    confirmButtonColor: "#2563eb"
                });
            }
        } catch (err) {
            console.error("Forgot password request failed:", err);
            setErrorMessage("Server connection error. Please try again later.");
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: "Could not connect to the server. Please check your connection.",
                confirmButtonColor: "#2563eb"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="account-page">
            <section className="account-showcase forgot-showcase">
                <Link to="/login" className="account-back">
                    <i className="bi bi-arrow-left"></i> Back to Login
                </Link>
                <div className="account-showcase-content">
                    <span className="vendor-eyebrow">
                        <i className="bi bi-shield-lock"></i> Account Security
                    </span>
                    <h1>Forgot your<br />password?</h1>
                    <p>Don't worry! It happens. Enter your registered email address and we will help you reset your account credentials safely.</p>
                    <div className="account-showcase-points">
                        <span><i className="bi bi-envelope-check"></i> Verification via OTP</span>
                        <span><i className="bi bi-clock-history"></i> Quick 10-minute validity</span>
                        <span><i className="bi bi-shield-check"></i> 100% Secure Reset</span>
                    </div>
                </div>
            </section>

            <section className="account-panel">
                <div className="account-card">
                    <Link to="/login" className="account-mobile-back">
                        <i className="bi bi-arrow-left"></i> Back to Login
                    </Link>
                    <span className="vendor-eyebrow vendor-eyebrow-dark">Password Recovery</span>
                    <h2>Reset your password</h2>
                    <p className="account-subtitle">Enter your email and we'll send you an OTP to verify your identity.</p>

                    <form onSubmit={sendLink} className="account-form">
                        <label className="vendor-field">
                            <span>Email address</span>
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    Send Verification OTP <i className="bi bi-arrow-right"></i>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="account-switch">
                        Remember your password? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
};