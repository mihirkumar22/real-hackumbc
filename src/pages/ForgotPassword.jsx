import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const emailRef = useRef();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSuccess(true);
        } catch (error) {
            setError('Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="forgot-password-container">
            <div className="form-container">
                <p className="title">Reset Password</p>
                {error && <div className="error-message">{error}</div>}
                {success && (
                    <div className="success-message">
                        Password reset email sent! Check your inbox.
                    </div>
                )}
                
                {!success ? (
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                placeholder="Enter your email"
                                ref={emailRef}
                                required
                            />
                        </div>
                        <button className="sign" type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Email"}
                        </button>
                    </form>
                ) : (
                    <div className="success-content">
                        <p className="success-text">
                            We've sent a password reset link to your email address.
                        </p>
                        <Link to="/login" className="back-to-login">
                            Back to Login
                        </Link>
                    </div>
                )}

                <div className="back-links">
                    <p className="signup">
                        Remember your password?
                        <Link to="/login" className="signup-link">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}