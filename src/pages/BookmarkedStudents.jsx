import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import CustomNavbar from '../components/CustomNavbar'
import { useUserContext } from '../contexts/UserContext'
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore'
import { Link } from 'react-router-dom';
import BG from '../components/images/regbg.jpg';

function BookmarkedStudents() {
    const { userData } = useUserContext();
    const [studentData, setStudentData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchStudentData() {
            try {
                const data = await Promise.all(
                    userData.savedStudents.map(async (student) => {
                        const docRef = doc(db, 'users', student);
                        const docSnap = await getDoc(docRef);
                        const appliedPostingsRef = doc(db, 'applied-postings', student);
                        const appliedPostingsSnap = await getDoc(appliedPostingsRef);

                        if (docSnap.exists() && appliedPostingsSnap.exists()) {
                            const userData = docSnap.data();
                            const appliedPostingsData = appliedPostingsSnap.data();

                            return {
                                ...userData,
                                appliedPostings: appliedPostingsData.appliedPostings
                            }
                        } else {
                            return "Unknown user";
                        }
                    })
                )
                setStudentData(data);
            } catch (error) {
                console.error("Error fetching applicant user names:", error);
            }
        }

        if (userData && userData.savedStudents) {
            fetchStudentData();
        }
    }, [userData])

    async function handleSaveStudent(studentId) {
        const confirm = window.confirm("Are you sure you want to remove this bookmark?");
        if (confirm) {
            const docRef = doc(db, 'users', userData.uid);
            if (userData.savedStudents.includes(studentId)) {
                updateDoc(docRef, { savedStudents: arrayRemove(studentId) });
            }
        }
    }

    function handlePostingClick(postingId) {
        navigate('/your-postings', { state: postingId });
    }

    return (
        <>
            <CustomNavbar />
            <div
                style={{
                    background: `url(${BG}) center/cover no-repeat`,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Card
                    style={{
                        width: '90%',
                        padding: '20px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.7)',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        height: '80vh'
                    }}
                >
                    <Card.Body>
                        <Card.Title>Bookmarked Students</Card.Title>
                        {studentData.length > 0 ?
                            <div>
                                {studentData.map((data, index) => (
                                    <Card key={index} style={{ display: 'flex', marginBottom: '10px', padding: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)', }}>
                                        <Card.Body style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <div>
                                                <Link to={`/view-profile/${data.uid}`} style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                    {data.userName || data.email}
                                                </Link>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                                    <span>Applied To:</span>
                                                    {data.appliedPostings?.map((postingData, idx) => (
                                                        postingData.employerId == userData.uid && (
                                                            <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                                                                <span
                                                                    style={{ textDecoration: 'underline', color: '#0d6efd', cursor: 'pointer', marginRight: '10px', marginLeft: '5px' }}
                                                                    onClick={() => handlePostingClick(postingData.postingId)}
                                                                >
                                                                    {postingData.title}
                                                                </span>
                                                                {postingData.status == 'approved' ? <span>← (Approved)</span> :
                                                                    postingData.status == 'rejected' && <span>← (Rejected)</span>
                                                                }
                                                                <br />
                                                            </div>
                                                        )
                                                    ))}
                                                </div>

                                            </div>
                                            <Button
                                                onClick={() => handleSaveStudent(data.uid)}
                                                variant="danger"
                                                size="sm"
                                                style={{maxHeight: '3em'}}
                                            >
                                                Remove bookmark
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                            : <Card.Text>No students found</Card.Text>}
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default BookmarkedStudents;
