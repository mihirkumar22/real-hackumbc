import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserContext } from '../../contexts/UserContext';
import BG from "../../components/images/regbg.jpg";

function ViewStudentProfile({ userId }) {
    const [studentData, setStudentData] = useState(null);
    const [resumeURL, setResumeURL] = useState(null);
    const [savedStudents, setSavedStudents] = useState(null);
    const [saveStudentLoading, setSaveStudentLoading] = useState(null);
    const { userData } = useUserContext();

    useEffect(() => {
        async function fetchStudentData() {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            setStudentData(docSnap.data());
        }

        async function fetchResume() {
            const resumeRef = doc(db, 'resumes', userId);
            const resumeSnap = await getDoc(resumeRef);

            if (resumeSnap.exists()) {
                setResumeURL(resumeSnap.data().resumeURL);
            }
        }

        fetchStudentData();
        if (userData.role !== 'student') {
            fetchResume();
        }
        if (userData.role === 'employer') {
            setSavedStudents(userData.savedStudents);
        }
    }, [userId]);

    async function handleSaveStudent() {
        setSaveStudentLoading(true);
        const docRef = doc(db, 'users', userData.uid);
        if (userData.savedStudents.includes(userId)) {
            await updateDoc(docRef, { savedStudents: arrayRemove(userId) });
            setSavedStudents(prev => prev.filter(id => id !== userId));
        } else {
            await updateDoc(docRef, { savedStudents: arrayUnion(userId) });
            setSavedStudents(prev => [...prev, userId]);
        }
        setSaveStudentLoading(false);
    }

    return (
        studentData &&
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
                        {studentData.userName || studentData.userEmail}
                    </Card.Title>
                    <br />
                    <Card.Text ><strong>Email Address:</strong> <u style={{color:'blue'}}>{studentData.email} </u></Card.Text>
                    <br />
                    <Card.Text><strong>Location:</strong> {studentData.location}</Card.Text>
                    <br />
                    <Card.Text><strong>Phone Number:</strong> {studentData.phoneNumber}</Card.Text>
                    <br />
                    <Card.Text><strong>Bio:</strong> {studentData.bio}</Card.Text>
                    {userData.role === 'employer' && (
                        <>
                            <Button
                                href={resumeURL || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                disabled={!resumeURL}
                                style={{ width: "100%", marginTop: "10px", border: "none" }}
                                variant="success"
                            >
                                {resumeURL ? "View Resume" : "No resume uploaded"}
                            </Button>                            <Button
                                onClick={() => handleSaveStudent(studentData.uid)}
                                disabled={saveStudentLoading}
                                style={{ width: "100%", marginTop: "10px", border: "none" }}
                                variant="success"
                            >
                                {saveStudentLoading ? "Loading... " :
                                    savedStudents.includes(studentData.uid) ? "Remove Bookmark" : "Add Bookmark"
                                }
                            </Button>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default ViewStudentProfile;
