import React from 'react'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

function NotLoggedIn() {
    return (
        <div
            style={{
                background: 'white',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
            }}
        >
            <Card
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '3rem',
                    textAlign: 'center',
                    maxWidth: '500px',
                    margin: 'auto',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Card.Body>
                    {/* Success Icon */}
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                        ✅
                    </div>
                    
                    {/* Main Message */}
                    <h2 style={{ 
                        color: '#22c55e', 
                        marginBottom: '1rem',
                        fontWeight: 'bold',
                        fontSize: '2rem'
                    }}>
                        Successfully Logged Out
                    </h2>
                    
                    <Card.Text style={{ 
                        marginBottom: '2rem',
                        color: '#374151',
                        fontSize: '1.1rem',
                        lineHeight: '1.6'
                    }}>
                        You have been successfully logged out of your account. 
                        Thank you for using Beanstalk! 🌱
                    </Card.Text>
                    
                    {/* Action Buttons */}
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1rem',
                        alignItems: 'center'
                    }}>
                        <Button
                            variant="default"
                            size="lg"
                            onClick={() => window.location.href = '/'}
                            style={{ minWidth: '200px' }}
                        >
                            Return Home 🏠
                        </Button>
                        
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => window.location.href = '/login'}
                            style={{ minWidth: '200px' }}
                        >
                            Login Again 🔐
                        </Button>
                    </div>
                    
                    {/* Additional Info */}
                    <div style={{ 
                        marginTop: '2rem',
                        padding: '1rem',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '10px',
                        border: '1px solid rgba(34, 197, 94, 0.2)'
                    }}>
                        <p style={{ 
                            margin: 0,
                            color: '#16a34a',
                            fontSize: '0.9rem'
                        }}>
                            Your session has been securely ended. Come back anytime to continue your ASL learning journey!
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default NotLoggedIn;
