import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import { useUserContext } from '../../contexts/UserContext'
import backgroundImage from '../../components/images/tree-bg.png';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'

function AdminDashboard() {
    const { userData } = useUserContext();
    const navigate = useNavigate();
    const [mobileView, setMobileView] = useState(false);

    useEffect(() => {
        const handleViewCheck = () => {
            if (window.innerWidth <= 600) {
                setMobileView(true);
            } else {
                setMobileView(false);
            }
        }

        window.addEventListener('resize', handleViewCheck);
        handleViewCheck();

        return () => window.removeEventListener('resize', handleViewCheck);
    }, [])


    return (
        <div
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
            }}>
            <Card
                style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '2rem',
                }}
            >
                <Card.Body>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif, Nunito',
                        textTransform: 'uppercase'
                    }}>
                        <i>Welcome,</i>
                    </div>
                    {!mobileView &&
                         <div style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            marginTop: '0.0rem'
                        }}>
                            {userData.userName ? userData.userName : userData.email}
                        </div>
                    }
                   {mobileView &&
                         <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginTop: '0.0rem'
                        }}>
                            {userData.userName ? userData.userName : userData.email}
                        </div>
                   }

                </Card.Body>
            </Card>
        </div>


    )
}

export default AdminDashboard;