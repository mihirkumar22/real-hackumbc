import React, { useState, useEffect } from "react";
import { Card, Form, Button, Container } from "react-bootstrap";
import { useUserContext } from "../../contexts/UserContext";
import BG from "../../components/images/regbg.jpg";

function EmployerEditProfile() {
    const { loading, userData, updateUserData } = useUserContext();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        companyName: "",
        phoneNumber: "",
        location: "",
        bio: "",
        address: ""
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                companyName: userData.companyName || "",
                phoneNumber: userData.phoneNumber || "",
                location: userData.location || "",
                bio: userData.bio || "",
                address: userData.address || ""
            });
        }
    }, [userData]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    async function handleSave() {
        if (editing) setSaving(true);
        setEditing((prev) => !prev);
        try {
            await updateUserData(formData);
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <Card.Text>Loading...</Card.Text>;

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
                    background: "rgba(255, 255, 255, 0.75)",
                    //backdropFilter: "blur(3px)",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)",
                    border: "none", 
                    
                }}
            >
                <Card.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label> <b> Company Name </b></Form.Label>
                            <Form.Control
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Form.Label><b>Phone Number</b></Form.Label>
                            <Form.Control
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Form.Label><b>Location</b></Form.Label>
                            <Form.Control
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Form.Label><b>Address</b></Form.Label>
                            <Form.Control
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Form.Label><b>Company Bio</b></Form.Label>
                            <Form.Control
                                name="bio"
                                as="textarea"
                                value={formData.bio}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Form.Group>
                        <Button
                            onClick={handleSave}
                            style={{
                                width: "100%",
                                marginTop: "10px",
                                border: "none"
                            }}
                            variant="success"
                        >
                            {saving ? "Saving..." : editing ? "Save" : "Edit"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default EmployerEditProfile;
