import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import BG from "../../components/images/regbg.jpg";

function ViewEmployerProfile({ userId }) {
    const [employerData, setEmployerData] = useState(null);

    useEffect(() => {
        async function fetchEmployerData() {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            setEmployerData(docSnap.data());
        }

        fetchEmployerData();
    }, [userId]);

    if (!employerData) return <Card.Text>Loading...</Card.Text>;

    return (
        <div
            style={{
                background: `url(${BG}) center/cover no-repeat`,
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Card
                style={{
                    width: "90vh",
                    padding: "20px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.85)",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    border: "none"
                }}
            >
                <Card.Body>
                    <Card.Title style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
                        {employerData.companyName || employerData.email}
                    </Card.Title>
                    <br />
                    <Card.Text><strong>Email Address:</strong> <u style={{color:'blue'}}>{employerData.email} </u></Card.Text>
                    <br />
                    <Card.Text><strong>Location:</strong> {employerData.location}</Card.Text>
                    <br />
                    <Card.Text><strong>Phone Number:</strong> {employerData.phoneNumber}</Card.Text>
                    <br />
                    <Card.Text><strong>Bio:</strong> {employerData.bio}</Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ViewEmployerProfile;
