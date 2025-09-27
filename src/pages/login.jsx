import React, { useRef, useState } from "react"; // Add missing imports
import AuthCard from "../components/AuthCard";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="stack">
      <AuthCard
        title="Login"
        footer={
          <>
            <p>
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
            <p>
              <a href="/forgot-password">Forgot Password?</a>
            </p>
          </>
        }
      >
        {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
        <form onSubmit={handleSubmit}> {/* Add onSubmit handler */}
          <input 
            type="email" 
            placeholder="Email" 
            required 
            ref={emailRef} /* Add ref */
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            ref={passwordRef} /* Add ref */
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}