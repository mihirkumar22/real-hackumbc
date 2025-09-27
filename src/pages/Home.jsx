import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundVideo from '../components/images/homevid.mp4';
import logo from '../components/images/SkillStartLogoBG.png.png';


export default function Home() {
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
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            {/* Video Section (Hero) */}
            <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
                <video
                    src={backgroundVideo}
                    autoPlay
                    loop
                    muted
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
                {/* Overlay Content */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        color: 'white',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <h1 style={{ fontSize: '4.5rem', fontWeight: 'bold', color: "white", marginBottom: '10px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', fontFamily: "'Orbitron', sans-serif" }}>
                        Magnolia
                    </h1>
                    <h2 style={{ fontSize: '1.6rem', fontStyle: 'italic', marginBottom: '10px', color: "white", textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                        Strive to Thrive
                    </h2>
                    <img src={logo} alt="SkillStart Logo" style={{ width: '150px', marginBottom: '20px' }} />
                    {!mobileView &&
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '50px ' }}>
                            <div
                                style={{
                                    backgroundColor: 'rgba(137, 122, 122, 0.4)',
                                    display: "flex",
                                    width: "80%",
                                    borderRadius: "15px",
                                    padding: "30px",
                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)",
                                    justifyContent: "space-between",
                                }}
                            >
                                {/* Left Section */}
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <h1 style={{ fontSize: "2rem", marginBottom: "20px", color: "white", textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                                        What is Magnolia?
                                    </h1>
                                    <p style={{ fontSize: "1.2rem", color: "white" }}>
                                        <b> Internships, Careers, Volunteering, and More: <u> All a click Away</u>! </b> <br />Join today and maximize your professional potential.
                                    </p>
                                </div>

                                {/* Right Section (Log In / Create Account) */}
                                <div style={{ flex: 1, display: "flex", justifyContent: "right", alignItems: "center" }}>
                                    <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "15px", textAlign: "center", width: "250px", marginRight: '50px', boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)", }}>
                                        <button
                                            style={{
                                                backgroundColor: "#2e7d32",
                                                color: "white",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "20px",
                                                fontSize: "1rem",
                                                cursor: "pointer",
                                                marginBottom: "10px",
                                            }}
                                            onClick={() => navigate('/login')}
                                        >
                                            Log In
                                        </button>
                                        <div style={{ marginTop: "20px", fontSize: "0.9rem" }}>
                                            <a
                                                style={{
                                                    textDecoration: "none",
                                                    color: "#2e7d32",
                                                    fontWeight: "bold",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => navigate('/register')}
                                            >
                                                Create Account
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {mobileView &&
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                            {/* Left Section */}
                            <div style={{ width: "100%", marginBottom: "20px" }}>
                                <h1 style={{ fontSize: "2rem", marginBottom: "20px", color: "white", textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                                    What is Magnolia?
                                </h1>
                                <p style={{ fontSize: "1.2rem", color: "white" }}>
                                    <b> Internships, Careers, Volunteering, and More: <u>All a click Away</u>! </b> <br />Join today and maximize your professional potential.
                                </p>
                            </div>

                            {/* Right Section (Log In / Create Account) */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                                <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "15px", textAlign: "center", width: "250px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)" }}>
                                    <button
                                        style={{
                                            backgroundColor: "#2e7d32",
                                            color: "white",
                                            border: "none",
                                            padding: "10px 20px",
                                            borderRadius: "20px",
                                            fontSize: "1rem",
                                            cursor: "pointer",
                                            marginBottom: "10px",
                                        }}
                                        onClick={() => navigate('/login')}
                                    >
                                        Log In
                                    </button>
                                    <div style={{ marginTop: "20px", fontSize: "0.9rem" }}>
                                        <a
                                            style={{
                                                textDecoration: "none",
                                                color: "#2e7d32",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => navigate('/register')}
                                        >
                                            Create Account
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>


        </div>
    );
}
