import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import './CustomNavbar.css';

function CustomNavbar() {
    const { userData } = useUserContext();
    const { logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check if we're on the Learn page
    const isLearnPage = location.pathname === '/learn';

    return (
        <>
            {/* Mobile Menu Button */}
            <button 
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                ☰
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="mobile-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <nav className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                {/* Logo */}
                <div className="sidebar-logo">
                    {isLearnPage ? (
                        // On Learn page, make logo unclickable
                        <div className="logo-link" style={{ cursor: 'default', pointerEvents: 'none' }}>
                            <div className="text-lg">🌱</div>
                            <span className="text-sm font-bold">Beanstalk</span>
                        </div>
                    ) : (
                        // On other pages, keep it clickable
                        <Link to="/" className="logo-link">
                            <div className="text-lg">🌱</div>
                            <span className="text-sm font-bold">Beanstalk</span>
                        </Link>
                    )}
                </div>

            {/* Navigation Links */}
            <div className="sidebar-nav">
                <Link 
                    to="/dashboard" 
                    className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                    <span className="nav-icon">🏠</span>
                    <span className="nav-text">Home</span>
                </Link>
                
                <Link 
                    to="/learn" 
                    className={`nav-link ${location.pathname === '/learn' ? 'active' : ''}`}
                >
                    <span className="nav-icon">📚</span>
                    <span className="nav-text">Learn</span>
                </Link>
                
                <Link 
                    to="/edit-profile" 
                    className={`nav-link ${location.pathname === '/edit-profile' ? 'active' : ''}`}
                >
                    <span className="nav-icon">👤</span>
                    <span className="nav-text">Profile</span>
                </Link>

                <Link 
                    to="/social" 
                    className={`nav-link ${location.pathname === '/social' ? 'active' : ''}`}
                >
                    <span className="nav-icon">💬</span>
                    <span className="nav-text">Social</span>
                </Link>

            </div>

            {/* User Info & Logout */}
            <div className="sidebar-footer">
                {userData && (
                    <div className="user-info">
                        <div className="user-avatar">👤</div>
                        <div className="user-details">
                            <span className="user-name">{userData.displayName || 'User'}</span>
                            <span className="user-level">Level 1</span>
                        </div>
                    </div>
                )}
                
                <button 
                    className="logout-btn"
                    onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                    }}
                >
                    <span className="nav-icon">🚪</span>
                    <span className="nav-text">Logout</span>
                </button>
            </div>
        </nav>
        </>
    );
}

export default CustomNavbar;