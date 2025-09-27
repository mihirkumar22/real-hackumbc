import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import './Home.css';
import logo from '../components/images/BEANSTACKLogo.png';



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
        <div style={{ height: '100vh', overflowY: 'auto', backgroundColor: mobileView ? '#e0e0e0' : '#e0e0e0' }}>
            <LandingNavbar></LandingNavbar>
            <div className = "landing-hero">
                <div className = "landing-hero-left"></div>
                <div className = "landing-hero-right"></div>
            </div>
        </div>
    );
}
