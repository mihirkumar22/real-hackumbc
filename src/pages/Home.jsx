import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import './Home.css';



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
        <div>
            <LandingNavbar></LandingNavbar>
            <div className = "landing-hero">
                
            </div>
        </div>
    );
}
