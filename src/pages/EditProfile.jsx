import React, { useState, useEffect, useRef } from "react";
import { Card, Button } from "react-bootstrap";
import { useUserContext } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import CustomNavbar from "../components/CustomNavbar";
import defaultProfilePic from "../components/images/default-profile.png";
import "./EditProfile.css";

function EditProfile() {
    const { loading, userData } = useUserContext();
    const { currentUser, updateUserProfile } = useAuth();
    const [formData, setFormData] = useState({
        userName: "",
        profilePic: ""
    });
    const fileInputRef = useRef();

    useEffect(() => {
        if (userData) {
            setFormData({
                userName: userData.userName || "",
                profilePic: userData.profilePic || defaultProfilePic
            });
        }
    }, [userData]);

    if (loading) return <Card.Text>Loading...</Card.Text>;

    // Handle profile pic change
    const handleProfilePicChange = async (file) => {
        if (!file) return;
        try {
            const newProfilePicUrl = await updateUserProfile(currentUser.uid, formData, file);
            setFormData((prev) => ({ ...prev, profilePic: newProfilePicUrl }));
        } catch (err) {
            console.error("Failed to update profile pic:", err);
        }
    };

    // Handle username change
    const handleUsernameChange = async () => {
        const newUsername = prompt("Enter new username:", formData.userName);
        if (!newUsername || newUsername === formData.userName) return;

        try {
            await updateUserProfile(currentUser.uid, { ...formData, userName: newUsername });
            setFormData((prev) => ({ ...prev, userName: newUsername }));
        } catch (err) {
            console.error("Failed to update username:", err);
        }
    };

    // Extract streak data
    const currentStreak = userData?.currentStreak || 0;
    const maxStreak = userData?.maxStreak || 0;

    return (
        <div className="profile-container">
            <CustomNavbar />
            <Card className="profile-card text-center">
                <Card.Body>
                    {/* Profile Picture */}
                    <div className="profile-pic-container">
                        <img
                            src={formData.profilePic || defaultProfilePic}
                            alt="Profile"
                            className="profile-pic"
                        />
                        {/* Hidden file input */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={(e) => handleProfilePicChange(e.target.files[0])}
                        />
                    </div>

                    {/* Username */}
                    <div className="username-container mt-3">
                        <h4 className="profile-username">{formData.userName}</h4>
                    </div>

                    {/* Streak Circles */}
                    <div className="streak-container">
                        <div className="streak-circle max-streak" title="Max Streak">
                            {userData?.maxStreak || 0}
                        </div>
                        <div className="streak-circle current-streak" title="Current Streak">
                            {userData?.currentStreak || 0}
                        </div>
                    </div>


                    {/* Buttons */}
                    <div className="profile-button-container mt-3">
                        <Button
                            className="profile-form-button me-2"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Change Profile Pic
                        </Button>
                        <Button
                            className="profile-form-button"
                            onClick={handleUsernameChange}
                        >
                            Change Username
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default EditProfile;
