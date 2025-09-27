import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useUserContext } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import logo from '../components/images/SkillStartLogoBG.png.png';
import './CustomNavbar.css';


function CustomNavbar() {
    const { userData } = useUserContext();
    const { logout } = useAuth();
    const location = useLocation();

    return (
        <nav className="sidebar">
            <h2>Navbar</h2>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    );
}

export default CustomNavbar;
