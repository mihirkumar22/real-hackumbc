import React from 'react';
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom';

function Unauthorized() {
    return (
        <Card>
            <Card.Body>
                <Card.Title>Unauthorized</Card.Title>
                <Card.Text>You are not allowed to view this content</Card.Text>
                <Link to="/dashboard">Go to dashboard</Link>
            </Card.Body>
        </Card>   
    )
}

export default Unauthorized;