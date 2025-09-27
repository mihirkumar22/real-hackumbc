import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ReactQuill from 'react-quill'
import "react-quill/dist/quill.snow.css"
import { useUserContext } from '../contexts/UserContext'
import { usePostingsContext } from '../contexts/PostingsContext'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const Posting = React.forwardRef(({ postingData, location, onViewApplicants, onEditPosting }, ref) => {
    const { currentUser } = useAuth();
    const { userData } = useUserContext();
    const { handlePostingStatus, handlePostingApplication, deletePosting, checkExpiration } = usePostingsContext();
    const [applicants, setApplicants] = useState([]);
    const [applyLoading, setApplyLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [expirationStatus, setExpirationStatus] = useState(false);
    const [status, setStatus] = useState('');
    const [mobileView, setMobileView] = useState(null);
    const [applicantData, setApplicantData] = useState([]);

    const navigate = useNavigate();
    
    const role = userData.role;
    const uid = currentUser.uid;

    const postingId = location.state;

    useEffect(() => {
        async function fetchApplicantData() {
            const applicantsData = [];
            const applicantPromises = postingData.applicants.map(async (applicantId) => {
                const userRef = doc(db, 'users', applicantId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    applicantsData.push(userSnap.data());
                }
            })

            await Promise.all(applicantPromises);

            setApplicantData(applicantsData);
        }

        if (postingData && mobileView) {
            fetchApplicantData();
        }
    }, [postingData, mobileView])

    useEffect(() => {
        const handleViewCheck = () => {
            if (window.innerWidth <= 600) {
                setMobileView(true);
            } else {
                setMobileView(false);
            }
        }

        window.addEventListener('resize', handleViewCheck);
        handleViewCheck();

        return () => window.removeEventListener('resize', handleViewCheck);
    })

    useEffect(() => {
        setApplicants(postingData.applicants);

        setStatus(postingData.status);

        setExpirationStatus(checkExpiration(postingData.expirationDate, postingData.expirationTime,));
    }, [postingData])

    useEffect(() => {
        if (postingId == postingData.id) {
            onViewApplicants(postingData);
        }
    }, [])

    function handleProfileNavigate(studentId, postingId) {
        navigate(location.pathname, { state: postingId });
        navigate(`/view-profile/${studentId}`);
    }

    function handleDate(datePublished) {
        if (datePublished) {
            const date = new Date(datePublished);
            return format(date, "EEE, MMM dd, yyyy");
        }
        return "Date could not be formatted."
    }

    async function handleApply(userId) {
        if (!checkExpiration(postingData.expirationDate, postingData.expirationTime)) {
            window.alert("Sorry, this posting has already expired!");
            return;
        }

        setApplyLoading(true);
        if (applicants.includes(userId)) {
            const confirm = window.confirm("Are you sure you want to unapply?");
            if (confirm) {
                setApplicants(applicants.filter((a) => a !== userId));
                await handlePostingApplication(postingData.id, userId);
            }
        } else {
            setApplicants((prev) => [...prev, userId]);
            await handlePostingApplication(postingData.id, userId);
        }
        setApplyLoading(false);
    }

    async function postingStatus(status, source) {
        setStatusLoading(true);
        setStatus(status);
        await handlePostingStatus(postingData.id, status, source);
        setStatusLoading(false);
    }

    return (
        <div ref={ref}>
            {!mobileView &&
                <div style={{ marginBottom: '1em' }} >
                    <Card>
                        <Card.Header>
                            {!expirationStatus && <p style={{ marginBottom: '4px', color: 'red' }}><strong>Warning! This posting has expired.</strong></p>}
                            {role == 'admin' && <p style={{ marginBottom: '4px', textDecoration: 'underline' }}>Status: {statusLoading ? "Loading..." : status}</p>}
                            {role == 'employer' && location.pathname !== '/postings' && <p style={{ marginBottom: '4px', textDecoration: 'underline' }}>Status: {statusLoading ? "Loading..." : status}</p>}
                            {role == 'student' &&
                                <>
                                    {postingData.acceptedApplicants.includes(uid) && <p style={{ marginBottom: '4px', textDecoration: 'underline', color: 'green' }}>Accepted!</p>}
                                    {postingData.rejectedApplicants.includes(uid) && <p style={{ marginBottom: '4px', textDecoration: 'underline', color: 'red' }}>Rejected</p>}
                                    <Button
                                        onClick={() => handleApply(uid)}
                                        disabled={applyLoading || !expirationStatus}
                                        style={{ marginRight: '4px', marginTop: '2px', marginBottom: '8px' }}
                                        variant="success" 
                                    >
                                        {applyLoading ? "Loading..." : applicants.includes(uid) ? "Unapply" : "Apply"}
                                    </Button>
                                </>
                            }
                            <Card.Title>{postingData.title}</Card.Title>
                            {postingData.selectedTags.map((t, index) => (
                                <Button variant="success" style={{ marginRight: '4px' }} key={index} disabled>{t}</Button>
                            ))}
                            <Card.Text>Company: <Link to={`/view-profile/${postingData.uid}`}>{postingData.companyName}</Link></Card.Text>
                            {role == 'admin' &&
                                <>
                                    {status == 'approved' &&
                                        <Button disabled={statusLoading} onClick={() => postingStatus('pending', 'admin')} variant="success" style={{  marginRight: '4px' }}>
                                            {statusLoading ? "Loading..." : "Set to pending"}
                                        </Button>}
                                    {status == 'pending' &&
                                        <>
                                            <Button disabled={statusLoading} onClick={() => postingStatus('approved', 'admin')} variant="success" style={{  marginRight: '4px' }}>
                                                {statusLoading ? "Loading..." : "Approve"}
                                            </Button>
                                            <Button disabled={statusLoading} onClick={() => postingStatus('rejected', 'admin')} variant="success" style={{ marginRight: '4px' }}>
                                                {statusLoading ? "Loading..." : "Reject"}
                                            </Button>
                                        </>
                                    }
                                    <Button
                                        onClick={() => deletePosting(postingData.id)}
                                        style={{ marginRight: '4px' }}
                                        variant="danger" 
                                    >
                                        Delete
                                    </Button>
                                </>
                            }
                            {role == 'employer' && location.pathname == '/your-postings' &&
                                <>
                                    <Button onClick={() => deletePosting(postingData.id)} variant="success" style={{ marginRight: '4px' }}>Delete</Button>
                                    {status == 'draft' &&
                                        <>
                                            <Button disabled={statusLoading} onClick={() => postingStatus('pending', 'employer')} variant="success" style={{ marginRight: '4px' }}>
                                                {statusLoading ? "Loading..." : "Apply for approval"}
                                            </Button>
                                            <Button onClick={() => onEditPosting(postingData)} variant="success" style={{  marginRight: '4px' }}>
                                                Edit
                                            </Button>
                                        </>
                                    }
                                    {status == 'pending' && <Button disabled={statusLoading} onClick={() => postingStatus('draft', 'employer')} variant="success"  style={{  marginRight: '4px' }}>
                                        {statusLoading ? "Loading..." : "Set to draft"}
                                    </Button>}
                                    {status == 'rejected' && <Button disabled={statusLoading} onClick={() => postingStatus('draft', 'employer')} variant="success" style={{ marginRight: '4px' }}>
                                        {statusLoading ? "Loading..." : "Set to draft"}
                                    </Button>}
                                </>
                            }
                            <Button onClick={() => onViewApplicants(postingData)} variant="success"  style={{  marginRight: '4px' }}>Posting Details</Button>
                        </Card.Header>
                    </Card>
                </div>
            }
            {mobileView &&
                <Card
                    style={{ position: 'sticky', top: '6em', maxHeight: '85vh', marginBottom: '4px' }}
                >
                    <Card.Header>
                        <Card.Title>{postingData.title}</Card.Title>
                        <Card.Text style={{ marginBottom: '4px' }}>Expiration: {handleDate(postingData.expirationDate)}, {postingData.expirationTime} </Card.Text>
                        {role == 'student' &&
                                <>
                                    {postingData.acceptedApplicants.includes(uid) && <Card.Text>Accepted!</Card.Text>}
                                    {postingData.rejectedApplicants.includes(uid) && <Card.Text>Rejected</Card.Text>}
                                    <Button
                                        onClick={() => handleApply(uid)}
                                        disabled={applyLoading || !expirationStatus}
                                        style={{ marginRight: '4px' }}
                                        variant="success" 
                                    >
                                        {applyLoading ? "Loading..." : applicants.includes(uid) ? "Unapply" : "Apply"}
                                    </Button>
                                </>
                            }
                        {(applicantData.length > 0 && role == 'employer' && postingData.uid == userData.uid) ?
                            <div>
                                {applicantData.map((data, index) => (
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px', marginBottom: '2px' }} key={index}>
                                        <div>
                                            {postingData.acceptedApplicants.includes(data.uid) && "Accepted: "}
                                            {postingData.rejectedApplicants.includes(data.uid) && "Rejected: "}
                                            <span onClick={(() => handleProfileNavigate(data.uid, postingData.id))} style={{ color: "#007bff", cursor: 'pointer', textDecoration: 'underline' }}>{data.userName || data.email}</span>
                                        </div>
                                        <div>
                                            <Button variant="success" style={{ marginRight: '4px' }} onClick={() => handleApplicantStatus(data.uid, postingData.id, 'accepted')}>
                                                Accept
                                            </Button>
                                            <Button variant="danger" onClick={() => handleApplicantStatus(data.uid, postingData.id, 'rejected')}>
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div> : (role == 'employer' && postingData.uid == userData.uid) && <Card.Text>No applicants found.</Card.Text>
                        }
                    </Card.Header>
                    <Card.Body>
                        {postingData.selectedTags.map((t, index) => (
                            <Button key={index} variant="success" style={{  marginRight: '4px' }} disabled>{t}</Button>
                        ))}
                        <Card.Text><strong>Company: </strong><Link to={`/view-profile/${postingData.uid}`}>{postingData.companyName}</Link> <br />
                            <strong>Location: </strong>{postingData.location} <br />
                            <strong>Address: </strong>{postingData.address} </Card.Text>
                        <div style={{ maxHeight: '30vh', overflow: 'auto' }}>
                            <ReactQuill
                                value={postingData.jobDescription}
                                readOnly
                                theme="snow"
                                modules={{ toolbar: false }}
                            />
                        </div>
                    </Card.Body>
                </Card>
            }
        </div>
    )
})

export default Posting;