import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useUserContext } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationContext } from '../contexts/NotificationContext';
import logo from '../components/images/SkillStartLogoBG.png.png';
import idle from '../components/images/notisidle.png';
import alert from '../components/images/notisalert.png';


function CustomNavbar() {
    const { userData } = useUserContext();
    const { notificationsData, fetchNotifications } = useNotificationContext();
    const { logout } = useAuth();
    const location = useLocation();

    const role = userData.role;

    useEffect(() => {
        fetchNotifications();
    }, [location.pathname])

    //do this for dynamic navbat
    const navLinkStyle = (path) =>
        location.pathname === path
            ? { fontWeight: 'bold', color: 'darkgreen', textDecoration: 'none' }
            : { color: 'black', textDecoration: 'none' };

    return (
        <Navbar expand="lg" className="p-3" style={{ minWidth: '100vw', backgroundColor: '#f9f9f9', borderBottom: '2px solid #eaeaea', boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)", position: 'sticky', top: '0', zIndex: '1000' }}>
            <Container>
                <Navbar.Brand>
                    <img src={logo} alt="SkillStart Logo" style={{ height: '40px', width: 'auto' }} />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/dashboard" style={navLinkStyle('/dashboard')}>
                            Dashboard
                        </Nav.Link>
                        <Nav.Link as={Link} to="/postings" style={navLinkStyle('/postings')}>
                            Postings
                        </Nav.Link>
                        {role === 'student' && (
                            <Nav.Link as={Link} to="/your-applications" style={navLinkStyle('/your-applications')}>
                                Your Applications
                            </Nav.Link>
                        )}
                        {role === 'employer' && (
                            <>
                                <Nav.Link as={Link} to="/your-postings" style={navLinkStyle('/your-postings')}>
                                    Your Postings
                                </Nav.Link>
                                <Nav.Link as={Link} to="/bookmarked-students" style={navLinkStyle('/bookmarked-students')}>
                                    Bookmarked Students
                                </Nav.Link>
                            </>
                        )}

                    </Nav>


                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/notifications" style={navLinkStyle('/notifications')}>
                            {notificationsData.notificationStatus ?
                                <img src={alert} style={{ height: '20px', width: 'auto' }} />
                                :
                                <img src={idle} style={{ height: '20px', width: 'auto' }} />
                            }
                        </Nav.Link>
                        <NavDropdown
                            title={userData.companyName || userData.userName || userData.email || "Profile"}
                            id="user-profile-dropdown"
                            align="end"
                            menuVariant="light"
                            style={{ fontSize: '1.3rem' }}
                        >
                            {role !== 'admin' && (
                                <NavDropdown.Item
                                    as={Link}
                                    to="/edit-profile"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: 'black',
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Profile
                                </NavDropdown.Item>
                            )}
                            {role === 'employer' && (
                                <NavDropdown.Item
                                    as={Link}
                                    to="/your-postings"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: 'black',
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Your Postings
                                </NavDropdown.Item>
                            )}
                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                onClick={logout}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'red',
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                }}
                            >
                                <b> Log Out </b>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>



                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;
