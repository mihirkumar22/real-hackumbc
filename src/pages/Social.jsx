import React, { useState, useEffect } from "react";
import { Card, Form, ListGroup, Alert, Image } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useUserContext } from "../contexts/UserContext";
import { Button } from "../components/ui/button";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import emailjs from "emailjs-com";
import "./Social.css";
import CustomNavbar from "../components/CustomNavbar";
import defaultProfilePic from "../components/images/default-profile.png";

export default function Social() {
  const { currentUser } = useAuth();
  const { userData, updateUserData } = useUserContext();

  const [emailInput, setEmailInput] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [friendDetails, setFriendDetails] = useState({});

  useEffect(() => {
    if (userData?.friends) {
      setFriendsList(userData.friends);
      fetchFriendDetails(userData.friends);
    } else {
      setFriendsList([]);
      setFriendDetails({});
    }
  }, [userData]);

  async function fetchFriendDetails(friendUids) {
    const details = {};
    for (const uid of friendUids) {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        details[uid] = {
          name: data.userName || data.email,
          profilePic: data.profilePic || defaultProfilePic,
          maxStreak: data.maxStreak || 0,
          currentStreak: data.currentStreak || 0,
        };
      }
    }
    setFriendDetails(details);
  }

  async function handleAddFriend() {
    setMessage(null);
    setError(null);
    if (!emailInput) {
      setError("Please enter an email.");
      return;
    }
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", emailInput));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No user found with that email.");
        return;
      }

      const friendDoc = querySnapshot.docs[0];
      const friendData = friendDoc.data();
      const friendUid = friendData.uid;

      if (friendUid === currentUser.uid) {
        setError("You cannot add yourself as a friend.");
        return;
      }

      if (friendsList.includes(friendUid)) {
        setError("This user is already your friend.");
        return;
      }

      const newFriends = [...friendsList, friendUid];
      await updateUserData({ friends: newFriends });
      setFriendsList(newFriends);
      setFriendDetails((prev) => ({
        ...prev,
        [friendUid]: {
          name: friendData.userName || friendData.email,
          profilePic: friendData.profilePic || defaultProfilePic,
          maxStreak: friendData.maxStreak || 0,
          currentStreak: friendData.currentStreak || 0,
        },
      }));

      const friendRef = doc(db, "users", friendUid);
      const friendDocSnap = await getDoc(friendRef);
      if (friendDocSnap.exists()) {
        const friendFriends = friendDocSnap.data().friends || [];
        if (!friendFriends.includes(currentUser.uid)) {
          await updateDoc(friendRef, { friends: [...friendFriends, currentUser.uid] });
        }
      }

      // EmailJS invite
      emailjs
        .send(
          "service_xq5ji2p",
          "template_tu2xzkj",
          { to_email: friendData.email, from_name: userData.userName || currentUser.email },
          "Gs_Z9j0cHQFV_1H_m"
        )
        .then(() => console.log("Email sent"))
        .catch((err) => console.error("EmailJS error:", err));

      setMessage(`Friend added successfully: ${friendData.userName || friendData.email}`);
      setEmailInput("");
    } catch (err) {
      console.error(err);
      setError("Failed to add friend. Try again later.");
    }
  }

  return (
    <div className="social-container">
      <CustomNavbar />
      <Card className="social-card">
        <Card.Body>
          <h3>Your Friends</h3>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form className="social-form">
            <Form.Control
              className="social-input"
              type="email"
              placeholder="Enter friend's email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <Button className="social-button" variant="success" onClick={handleAddFriend}>
              Add Friend
            </Button>
          </Form>

          <ListGroup>
            {friendsList.length === 0 && <ListGroup.Item>No friends yet.</ListGroup.Item>}
            {friendsList.map((uid) => {
              const details = friendDetails[uid];
              return details ? (
                <ListGroup.Item key={uid} className="friend-item d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Image src={details.profilePic} roundedCircle className="friend-pic" />
                    <span className="friend-name ms-3">{details.name}</span>
                  </div>
                  <div className="friend-streaks d-flex gap-2">
                    <div className="streak-circle max" title="Max Streak">{details.maxStreak}</div>
                    <div className="streak-circle current" title="Current Streak">{details.currentStreak}</div>
                  </div>
                </ListGroup.Item>
              ) : null;
            })}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
