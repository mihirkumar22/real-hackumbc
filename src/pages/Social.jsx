import React, { useState, useEffect } from "react";
import { Card, Button, Form, ListGroup, Alert, Image } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useUserContext } from "../contexts/UserContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import "./Social.css";
import CustomNavbar from "../components/CustomNavbar";

export default function Social() {
  const { currentUser } = useAuth();
  const { userData, updateUserData } = useUserContext();

  const [emailInput, setEmailInput] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [friendDetails, setFriendDetails] = useState({}); // UID -> {name, profilePic}

  // Load friends list from userData
  useEffect(() => {
    if (userData?.friends) {
      setFriendsList(userData.friends);
      fetchFriendDetails(userData.friends);
    } else {
      setFriendsList([]);
      setFriendDetails({});
    }
  }, [userData]);

  // Fetch friend details (name + profilePic)
  async function fetchFriendDetails(friendUids) {
    const details = {};
    for (const uid of friendUids) {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        details[uid] = {
          name: data.userName || data.email,
          profilePic: data.profilePic || "/default-pfp.png", // fallback image
        };
      }
    }
    setFriendDetails(details);
  }

  // Add friend by email
  async function handleAddFriend() {
    setMessage(null);
    setError(null);

    if (!emailInput) {
      setError("Please enter an email.");
      return;
    }

    try {
      // Query user by email
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

      // Update current user's friends
      const newFriends = [...friendsList, friendUid];
      await updateUserData({ friends: newFriends });
      setFriendsList(newFriends);
      setFriendDetails((prev) => ({
        ...prev,
        [friendUid]: {
          name: friendData.userName || friendData.email,
          profilePic: friendData.profilePic || "/default-pfp.png",
        },
      }));

      // Update friend's friend list
      const friendRef = doc(db, "users", friendUid);
      const friendDocSnap = await getDoc(friendRef);
      if (friendDocSnap.exists()) {
        const friendFriends = friendDocSnap.data().friends || [];
        if (!friendFriends.includes(currentUser.uid)) {
          await updateDoc(friendRef, {
            friends: [...friendFriends, currentUser.uid],
          });
        }
      }

      // Call cloud function to send invite email
      await fetch(
        `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendFriendInvite?to=${emailInput}&from=${currentUser.email}`
      );

      setMessage(
        `Friend added successfully: ${friendData.userName || friendData.email}`
      );
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

          <Form className="mb-3">
            <Form.Control
              className="social-input"
              type="email"
              placeholder="Enter friend's email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <Button className="mt-2" variant="success" onClick={handleAddFriend}>
              Add Friend
            </Button>
          </Form>

          <ListGroup className="friend-list">
            {friendsList.length === 0 && (
              <ListGroup.Item>No friends yet.</ListGroup.Item>
            )}
            {friendsList.map((uid) => {
              const friend = friendDetails[uid];
              return (
                <ListGroup.Item key={uid} className="friend-item">
                  <div className="friend-row">
                    <Image
                      src={friend?.profilePic}
                      roundedCircle
                      className="friend-pfp"
                    />
                    <span className="friend-name">{friend?.name || uid}</span>
                    <div className="friend-streaks">
                      <span className="streak-circle"></span>
                      <span className="streak-circle"></span>
                    </div>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
