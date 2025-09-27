import React from 'react'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'

import BG from '../components/images/regbg.jpg';

function NotLoggedIn() {
    return (
        <div
            style={{
                backgroundImage: `url(${BG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Card
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '20px',
                    textAlign: 'center',
                    maxWidth: '400px',
                    margin: 'auto',
                }}
            >
                <Card.Body>
                    <Card.Text style={{ marginBottom: '10px' }}>
                        You are currently not logged into an account.
                    </Card.Text>
                    <Link
                        to="/"
                        style={{
                            display: 'block',
                            color: 'darkgreen',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            marginTop: '10px',
                        }}
                    >
                        Go Home
                    </Link>
                </Card.Body>
            </Card>
        </div>
    );
}

export default NotLoggedIn;
