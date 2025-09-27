import React, { useState, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BG from '../components/images/tree-bg.png';

export default function Login () {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');
    
    const emailRef = useRef();
    const passwordRef = useRef();

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/dashboard')
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ backgroundImage: `url(${BG})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
                <Card style={{ width: '100%', maxWidth: '400px', borderRadius: '10px', boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)", border: 'none', backgroundColor: 'rgba(255, 255, 255, .6)' }}>
                    <Card.Body>
                        <Card.Title style={{ textAlign: 'center', fontWeight: 'bold', color:'darkgreen', }}>LOGIN</Card.Title>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit} >
                            <Form.Group id="email" style={{ marginBottom: '15px' }}>
                                <Form.Label><b>Email Address</b></Form.Label>
                                <Form.Control type="email" placeholder="Enter email" ref={emailRef} />
                            </Form.Group>
                            <Form.Group id="password" style={{ marginBottom: '15px' }}>
                                <Form.Label><b>Enter Password</b></Form.Label>
                                <Form.Control type="password" placeholder="Enter password" ref={passwordRef} />
                            </Form.Group>
                            <Button 
                                type="submit" disabled={loading} style={{ width: '100%', marginTop: '15px',

                                    backgroundColor: '#28a745', 
                                    borderColor: '#28a745',
                                    padding: '10px 0', 
                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = '#218838')} // Dark green on hover
                                onMouseLeave={(e) => (e.target.style.backgroundColor = '#28a745')} // Reset to green on hover out
                            >
                                {loading ? "Loading..." : "Submit"}
                            </Button>
                        </Form>
                        <Card.Text style={{ textAlign: 'center', marginTop: '15px' }}>
                            <b >Don't have an account?</b> <Link to="/register" style={{color: 'darkGreen'}} onMouseEnter={(e) => (e.target.style.color = '#218838')} onMouseLeave={(e) => (e.target.style.color = 'darkGreen')}><b> Create Account </b></Link>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}
