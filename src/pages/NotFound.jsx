import React from 'react'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import CustomNavbar from '../components/CustomNavbar'

function NotFound() {
    const { currentUser } = useAuth();

    return (
        <div>
            { currentUser && <CustomNavbar />}
            <Card>
                <Card.Body>
                    <Card.Text>404 - Page Not Found</Card.Text>
                    { !currentUser && <Link to="/">Go to login</Link> }
                </Card.Body>
            </Card>
        </div>
    )
}

export default NotFound;