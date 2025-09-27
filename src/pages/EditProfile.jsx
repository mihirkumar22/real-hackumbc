import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useUserContext } from "../contexts/UserContext";
import BG from "../components/images/regbg.jpg";

function EditProfile() {
    const { loading, userData, updateUserData } = useUserContext();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        userName: "",
        phoneNumber: "",
        location: "",
        bio: ""
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                userName: userData.userName || "",
                phoneNumber: userData.phoneNumber || "",
                location: userData.location || "",
                bio: userData.bio || ""
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
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)",
                    border: "none"
                }}
            >
                <Card.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label><b>Your Name</b></Form.Label>
                            <Form.Control
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label><b>Phone Number</b></Form.Label>
                            <Form.Control
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label><b>Location</b></Form.Label>
                            <Form.Control
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label><b>About You</b></Form.Label>
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
                <UploadResume />
 
            </Card>
        </div>
    );
}

export default EditProfile;
