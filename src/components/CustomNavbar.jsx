import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useUserContext } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import logo from '../components/images/SkillStartLogoBG.png.png';


function CustomNavbar() {
    const { userData } = useUserContext();
    const { logout } = useAuth();
    const location = useLocation();

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
                    </Nav>


                    <Nav className="ms-auto">
                        <NavDropdown
                            title={userData.companyName || userData.userName || userData.email || "Profile"}
                            id="user-profile-dropdown"
                            align="end"
                            menuVariant="light"
                            style={{ fontSize: '1.3rem' }}
                        >
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
