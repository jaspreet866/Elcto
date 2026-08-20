import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE } from "./apiConfig";

export const ResetPassword = () => {
    const [pass, setPass] = useState("");
    const [cpass, setCpass] = useState("");
    const [mail, setMail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailFromUrl = params.get("email");
        const savedEmail = emailFromUrl || localStorage.getItem("email") || "";
        setMail(savedEmail);
        if (emailFromUrl) {
            localStorage.setItem("email", emailFromUrl);
        }
    }, []);

    // Password validation rules
    const hasMinLength = pass.length >= 8;
    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/.test(pass);
    const passwordsMatch = pass && cpass && pass === cpass;
    const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;

    const reset = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const cleanEmail = mail.trim().toLowerCase();
        if (!cleanEmail) {
            setErrorMessage("Email address is missing. Please start password recovery again.");
            Swal.fire({
                icon: "warning",
                title: "Missing Email",
                text: "Please request an OTP first.",
                confirmButtonColor: "#2563eb"
            });
            navigate("/forgot");
            return;
        }

        if (!pass || !cpass) {
            setErrorMessage("Please fill in both password fields.");
            return;
        }

        if (pass !== cpass) {
            setErrorMessage("Passwords do not match. Please verify your new password.");
            return;
        }

        if (!isPasswordValid) {
            setErrorMessage("Password must contain at least 8 characters, uppercase, lowercase, number & special character.");
            return;
        }

        setLoading(true);
        try {
            const result = await fetch(`${API_BASE}/api/resetpassword/${encodeURIComponent(cleanEmail)}`, {
                method: "PUT",
                body: JSON.stringify({ pass, cpass }),
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            });

            if (result) {
                const res = await result.json();
                if (res.statuscode === 1) {
                    localStorage.removeItem("email");
                    await Swal.fire({
                        icon: "success",
                        title: "Password Reset Successful! 🎉",
                        text: "Your password has been successfully updated. You can now sign in with your new credentials.",
                        confirmButtonColor: "#2563eb"
                    });
                    navigate("/login");
                } else {
                    setErrorMessage(res.message || "Failed to update password.");
                    Swal.fire({
                        icon: "error",
                        title: "Reset Failed",
                        text: res.message || "Could not update password. Please try again.",
                        confirmButtonColor: "#2563eb"
                    });
                }
            }
        } catch (err) {
            console.error("Reset password network error:", err);
            setErrorMessage("Connection error. Could not reach the server.");
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: "Please check your connection and try again.",
                confirmButtonColor: "#2563eb"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="account-page">
            <section className="account-showcase reset-showcase">
                <Link to="/login" className="account-back">
                    <i className="bi bi-arrow-left"></i> Back to Login
                </Link>
                <div className="account-showcase-content">
                    <span className="vendor-eyebrow">
                        <i className="bi bi-shield-check"></i> Secure Your Account
                    </span>
                    <h1>Create a new<br />password.</h1>
                    <p>Almost there! Set a strong, unique password to secure your Elcto account and orders.</p>
                    <div className="account-showcase-points">
                        <span><i className="bi bi-check2-circle"></i> Min 8 chars with mixed case</span>
                        <span><i className="bi bi-check2-circle"></i> Numbers & special characters</span>
                        <span><i className="bi bi-check2-circle"></i> Instant encrypted update</span>
                    </div>
                </div>
            </section>

            <section className="account-panel">
                <div className="account-card">
                    <Link to="/login" className="account-mobile-back">
                        <i className="bi bi-arrow-left"></i> Back to Login
                    </Link>
                    <span className="vendor-eyebrow vendor-eyebrow-dark">Final Step</span>
                    <h2>Reset Password</h2>
                    <p className="account-subtitle">
                        Updating password for: <strong>{mail || "your account"}</strong>
                    </p>

                    <form onSubmit={reset} className="account-form">
                        {!mail && (
                            <label className="vendor-field">
                                <span>Account Email</span>
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your registered email"
                                    value={mail}
                                    onChange={(e) => setMail(e.target.value)}
                                />
                            </label>
                        )}

                        <label className="vendor-field">
                            <span>New Password</span>
                            <div className="account-password-input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="new-password"
                                    placeholder="Create new password"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </button>
                            </div>
                        </label>

                        <label className="vendor-field">
                            <span>Confirm New Password</span>
                            <div className="account-password-input">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    autoComplete="new-password"
                                    placeholder="Repeat new password"
                                    value={cpass}
                                    onChange={(e) => setCpass(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </button>
                            </div>
                        </label>

                        {/* Visual Password Strength Checklist */}
                        {pass.length > 0 && (
                            <div className="p-3 bg-light rounded-3 border" style={{ fontSize: "0.76rem" }}>
                                <div className="fw-bold mb-1 text-secondary">Password Requirements:</div>
                                <div className="d-grid gap-1">
                                    <span style={{ color: hasMinLength ? "#16a34a" : "#dc2626" }}>
                                        <i className={`bi ${hasMinLength ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-1`}></i> At least 8 characters
                                    </span>
                                    <span style={{ color: hasUppercase && hasLowercase ? "#16a34a" : "#dc2626" }}>
                                        <i className={`bi ${hasUppercase && hasLowercase ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-1`}></i> Uppercase & lowercase letters
                                    </span>
                                    <span style={{ color: hasNumber && hasSpecial ? "#16a34a" : "#dc2626" }}>
                                        <i className={`bi ${hasNumber && hasSpecial ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-1`}></i> Number & special character (!@#$%^&*)
                                    </span>
                                    {cpass.length > 0 && (
                                        <span style={{ color: passwordsMatch ? "#16a34a" : "#dc2626" }}>
                                            <i className={`bi ${passwordsMatch ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-1`}></i> Passwords match
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {errorMessage && (
                            <p className="account-error" role="alert">
                                <i className="bi bi-exclamation-circle me-1"></i> {errorMessage}
                            </p>
                        )}

                        <button
                            className="vendor-primary-btn"
                            type="submit"
                            disabled={loading || (pass.length > 0 && (!isPasswordValid || !passwordsMatch))}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Updating Password...
                                </>
                            ) : (
                                <>
                                    Reset Password <i className="bi bi-check-lg"></i>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="account-switch">
                        Remember your credentials? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
};
