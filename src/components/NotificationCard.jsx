import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useUserContext } from '../contexts/UserContext'
import { usePostingsContext } from '../contexts/PostingsContext'

function NotificationCard({ notification, handlePostingClick, handleDelete, handleDate }) {
    const { postings } = usePostingsContext();

    const [notificationValidation, setNotificationValidation] = useState(true);
    const [postingExists, setPostingExists] = useState(true);
    const { userData } = useUserContext();

    if (notification.postingId) {
        useEffect(() => {
            if (postings.length > 0) {
                const allPostingIds = postings.map((p) => {
                    return p.id;
                })

                if (!allPostingIds.includes(notification.postingId)) {
                    setPostingExists(false);
                } else {
                    setPostingExists(true);
                }
            }
        }, [postings])
    }

    useEffect(() => {
        if (notification.type == "New Applicant") {
            async function checkValidation() {
                const applicantId = notification.studentId;

                const applicantRef = doc(db, 'applied-postings', applicantId);
                const applicantSnap = await getDoc(applicantRef);

                const applicantApplications = applicantSnap.data().appliedPostings;

                let count = 0;
                for (const application of applicantApplications) {
                    if (application.postingId == notification.postingId) {
                        count++;
                    }
                }
                if (count == 1) {
                    setNotificationValidation(true);
                } else {
                    setNotificationValidation(false);
                }
            }

            checkValidation();
        }

        if (notification.type == "Posting Status") {
            async function checkValidation() {
                const postingId = notification.postingId;
                if (!postingExists) {
                    setNotificationValidation(true);
                    return;
                }
                const postingRef = doc(db, 'postings', postingId);
                const postingSnap = await getDoc(postingRef);
                console.log(notification.newStatus);
                if (postingSnap.data()?.status !== notification.status) {
                    setNotificationValidation(false);
                } else {
                    setNotificationValidation(true);
                }
            }

            checkValidation();
        }

        if (notification.type == "Request Posting Approval") {
            async function checkValidation() {
                const postingId = notification.postingId;

                const postingRef = doc(db, 'postings', postingId);
                const postingSnap = await getDoc(postingRef);

                if (postingSnap.data()?.status !== 'pending') {
                    setNotificationValidation(false);
                } else {
                    setNotificationValidation(true);
                }
            }

            checkValidation();
        }

        if (notification.type == 'Student Application Status') {
            async function checkValidation() {
                const postingId = notification.postingId;
                if (!postingExists) {
                    setNotificationValidation(true);
                    return;
                }
                const postingRef = doc(db, 'postings', postingId);
                const postingSnap = await getDoc(postingRef);

                const status = notification.status;
                if (status == 'accepted') {
                    const acceptedApplicants = postingSnap.data()?.acceptedApplicants || [];
                    if (!acceptedApplicants.includes(userData.uid)) {
                        setNotificationValidation(false);
                    } else {
                        setNotificationValidation(true);
                    }
                } else if (status == 'rejected') {
                    const rejectedApplicants = postingSnap.data()?.rejectedApplicants || [];
                    if (!rejectedApplicants.includes(userData.uid)) {
                        setNotificationValidation(false);
                    } else {
                        setNotificationValidation(true);
                    }
                }
            }

            checkValidation();
        }
    }, [])

    return (
        <Card style={{ display: 'flex', marginBottom: '10px', padding: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)', }}>
            <Card.Body style={{ paddingBottom: '2px' }}>
                {!postingExists && <p style={{ marginBottom: '4px', color: 'red' }}><strong>Warning! This posting was not found.</strong></p>}
                {notification.type == "New Applicant" &&
                    <>
                        {!notificationValidation && <p style={{ marginBottom: '4px', color: 'red' }}><strong>Warning! Student is no longer applied to this posting.</strong></p>}
                        <Card.Text style={{marginBottom: '4px'}}>New Applicant!</Card.Text>
                        <Link to={`/view-profile/${notification.studentId}`}>{notification.studentName}</Link>
                            {" has applied to: "}
                            <span
                                style={{ textDecoration: 'underline', color: '#0d6efd', cursor: 'pointer' }}
                                onClick={() => handlePostingClick(notification.postingId, 'employer')}
                            >
                                {notification.postingTitle}
                            </span>
                    </>
                }

                {notification.type == "Posting Status" &&
                    <>
                        {!notificationValidation && <p style={{ marginBottom: '4px', color: 'red' }}><strong>Warning! This notification is no longer up to date.</strong></p>}
                        <Card.Text style={{ marginBottom: '4px' }}>Posting Status Updated</Card.Text>
                        <span
                            style={{ textDecoration: 'underline', color: '#0d6efd', cursor: 'pointer' }}
                            onClick={() => handlePostingClick(notification.postingId, 'employer')}
                        >
                            {notification.postingTitle}
                        </span>
                        {' '}has been {notification.status == 'pending' ? "set to pending." : notification.status}
                    </>
                }

                {notification.type == "Expired Posting" &&
                    <>
                        {!notificationValidation && <Card.Text>Warning! This notification is no longer up to date.</Card.Text>}
                        <Card.Text style={{ marginBottom: '4px' }}>Posting has expired</Card.Text>
                        <span
                            style={{ textDecoration: 'underline', color: '#0d6efd', cursor: 'pointer' }}
                            onClick={() => handlePostingClick(notification.postingId)}
                        >
                            {notification.title}
                        </span>
                        Expired on {notification.date}
                    </>
                }

                {notification.type == 'Request Posting Approval' &&
                    <>
                        {!notificationValidation && <p style={{ marginBottom: '4px', color: 'red' }}><strong>Warning! This notification is no longer up to date.</strong></p>}
                        <Card.Text style={{ marginBottom: '4px' }}>{notification.employerName} has requested approval for the following posting: </Card.Text>
                        <span
                            style={{ textDecoration: 'underline', color: '#0d6efd', cursor: 'pointer' }}
                            onClick={() => handlePostingClick(notification.postingId, 'admin')}
                        >
                            {notification.postingTitle}
                        </span>
                    </>
                }

                {notification.type == 'Student Application Status' &&
                    <>
                        {!notificationValidation && <p style={{ marginBottom: '4px', color: 'red' }}><strong>Warning! This notification is no longer up to date.</strong></p>}
                        <Card.Text style={{ marginBottom: '4px' }}>You have been
                            {notification.status == 'accepted' && " accepted to "}
                            {notification.status == 'rejected' && " rejected from "}
                            the following posting:
                        </Card.Text>
                        <span
                            style={{ textDecoration: 'underline', color: '#0d6efd', cursor: 'pointer' }}
                            onClick={() => handlePostingClick(notification.postingId, 'student')}
                        >
                            {notification.postingTitle}
                        </span>
                    </>
                }
                <Card.Text style={{ color: 'grey' }}> <i> <b> {handleDate(notification.time)} </b> </i></Card.Text>
                <Button style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: 'rgba(0,0,0,0)',
                    color: "red",
                    padding: "8px 12px",
                    fontSize: "14px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    minWidth: "40px",
                }} onClick={() => handleDelete(notification)}>❌</Button>
            </Card.Body>
        </Card>
    )
}

export default NotificationCard;