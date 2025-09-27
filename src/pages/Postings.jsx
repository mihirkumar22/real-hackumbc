// React & Hooks
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// Third-Party Libraries
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { format } from 'date-fns';

// Firebase
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

// Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import ButtonGroup from 'react-bootstrap/Button';

// Custom Components
import CustomNavbar from '../components/CustomNavbar';
import FiltersDisplay from '../components/FiltersDisplay';
import Posting from '../components/Posting';

// Contexts
import { usePostingsContext } from '../contexts/PostingsContext';
import { useUserContext } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationContext } from '../contexts/NotificationContext';

// Images
import backgroundImage from '../components/images/tree-bg.png';

function Postings() {
    const { filteredPostings, tags, checkExpiration, fetchPostings } = usePostingsContext();
    const { userData } = useUserContext();
    const { currentUser } = useAuth();
    const { studentApplicationStatus } = useNotificationContext();

    const [filteredLocalPostings, setFilteredLocalPostings] = useState([]); // State for filtered postings
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [selectedTags, setSelectedTags] = useState([]); // State for selected tags
    const [selectedPosting, setSelectedPosting] = useState(null); // State for modal
    const [showStatusFilters, setShowStatusFilters] = useState(false);
    const [noPosting, setNoPosting] = useState(false);
    const [showSelectedModal, setShowSelectedModal] = useState(false);
    const [applicantData, setApplicantData] = useState([]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editPosting, setEditPosting] = useState(null);
    const [formStatus, setFormStatus] = useState('');
    const [draftLoading, setDraftLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [isLoaded, setIsLoaded] = useState(false);

    const [mobileView, setMobileView] = useState(false);

    const postingRefs = useRef({});
    const location = useLocation();
    const navigate = useNavigate();

    const role = userData.role;
    const uid = currentUser.uid;

    const postingIdFromState = location.state;

    useEffect(() => {
        setSelectedTags([]);
    }, [location.pathname])

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
    }, [])

    useEffect(() => {
        const allPostingIds = filteredPostings.map((p) => p.id);

        if (postingIdFromState && !allPostingIds.includes(postingIdFromState)) {
            setNoPosting(true);
        } else {
            setNoPosting(false);
        }

    }, [filteredPostings])

    useEffect(() => {
        setSelectedPosting(null);
    }, [location.pathname])

    useEffect(() => {
        if (isLoaded && location.state) {
            const target = postingRefs.current[location.state];
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });

                setTimeout(() => {
                    window.scrollBy({ top: -100, left: 0, behavior: "smooth" }); // Adjusts 100px above
                }, 500); // Wait 500ms for the initial scroll
            }
        }
    }, [location.state, isLoaded])

    useEffect(() => {
        async function fetchApplicantData() {
            const applicantsData = [];
            const applicantPromises = selectedPosting.applicants.map(async (applicantId) => {
                const userRef = doc(db, 'users', applicantId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    applicantsData.push(userSnap.data());
                }
            })

            await Promise.all(applicantPromises);

            setApplicantData(applicantsData);
        }

        if (selectedPosting) {
            fetchApplicantData();
        }
    }, [selectedPosting])

    // Filters postings based on search query and selected tags
    useEffect(() => {
        let filtered = filteredPostings;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(posting =>
                posting.jobDescription.toLowerCase().includes(searchQuery.toLowerCase()) || posting.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by selected tags
        if (selectedTags.length > 0) {
            filtered = filtered.filter(posting =>
                posting.selectedTags && posting.selectedTags.some(tag => selectedTags.includes(tag))
            );
        }

        // Apply route-specific filtering
        if (location.pathname === '/postings') {
            filtered = filtered.filter((p) => checkExpiration(p.expirationDate, p.expirationTime));
            if (role !== 'admin') {
                filtered = filtered.filter(p => p.status === 'approved');
                setShowStatusFilters(false);
            } else {
                setShowStatusFilters(true);
            }
        } else if (location.pathname === '/your-postings') {
            filtered = filtered.filter(p => p.uid === uid);
            setShowStatusFilters(true);
        } else if (location.pathname === '/your-applications') {
            filtered = filtered.filter(p => p.applicants.includes(userData.uid));
            setShowStatusFilters(false);
        }

        setFilteredLocalPostings(filtered);
        setIsLoaded(true);
    }, [searchQuery, selectedTags, filteredPostings, location.pathname]);

    // Handle change in search input
    function handleSearchChange(e) {
        setSearchQuery(e.target.value);
    }

    // Handle tag filtering
    function handleTagChange(tag) {
        setSelectedTags(prevTags =>
            prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
        );
    }

    // Format date
    function handleDate(datePublished) {
        if (datePublished) {
            const date = new Date(datePublished);
            return format(date, "EEE, MMM dd, yyyy");
        }
        return "Date could not be formatted."
    }

    function handleProfileNavigate(studentId, postingId) {
        navigate(location.pathname, { state: postingId });
        navigate(`/view-profile/${studentId}`);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setEditPosting((prev) => ({ ...prev, [name]: value }));
    }

    function handleTagChange(tag) {
        const prevSelectedTags = editPosting.selectedTags;
        setEditPosting((prev) => {
            if (prevSelectedTags.includes(tag)) {
                return { ...prev, selectedTags: prevSelectedTags.filter((t) => t != tag) };
            } else {
                return { ...prev, selectedTags: [...prevSelectedTags, tag] };
            }
        })
    }

    function handleAutoFill() {
        setEditPosting((prev) => ({
            ...prev,
            companyName: userData.companyName || '',
            location: userData.location || '',
            address: userData.address || '',
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const newEditPosting = {
            ...editPosting,
            datePublished: new Date().toISOString(),
        }

        if (formStatus == 'submit') {
            newEditPosting.status = 'pending';
            setSubmitLoading(true);
        } else {
            newEditPosting.status = 'draft';
            setDraftLoading(true);
        }

        const postingRef = doc(db, 'postings', newEditPosting.id);
        await updateDoc(postingRef, newEditPosting);
        setSubmitLoading(false);
        setDraftLoading(false);
        fetchPostings(role);
        setShowEditModal(false);
    }

    async function handleApplicantStatus(applicantId, postingId, newStatus) {
        // Get reference and document to the firebase posting and student who applied
        const postingRef = doc(db, 'postings', postingId);
        const postingSnap = await getDoc(postingRef);

        const applicantPostingsRef = doc(db, 'applied-postings', applicantId);
        const applicantPostingsSnap = await getDoc(applicantPostingsRef);

        // Get the current posting's data saved to the students applied postings
        // Filter out the posting's data from the main array
        let applicantPostings = applicantPostingsSnap.data().appliedPostings;
        const applicantPostingData = applicantPostings.filter((a) => a.postingId == postingId);
        applicantPostings = applicantPostings.filter((a) => a.postingId != postingId);

        if (newStatus == 'accepted') {
            // Get existing accepted applicants and rejected applicants to the posting
            let newApplicants = postingSnap.data().acceptedApplicants;
            let otherApplicants = postingSnap.data().rejectedApplicants;

            // If the applicant is already accepted, then remove them from the accepted array
            // and adjust the posting's data saved in the student's applied postings to match.

            // Else, add the applicant to the accepted array, and update the posting's data
            // saved in the student's applied postings to match
            if (newApplicants.includes(applicantId)) {
                newApplicants = newApplicants.filter((a) => a !== applicantId);
                applicantPostingData[0].status = '';
            } else {
                newApplicants.push(applicantId);
                applicantPostingData[0].status = 'accepted';
                studentApplicationStatus(applicantId, postingId, newStatus);
            }

            // If rejected applicants includes the applicant, remove them since
            // they can't be accepted and rejected at the same time
            if (otherApplicants.includes(applicantId)) {
                otherApplicants = otherApplicants.filter((a) => a !== applicantId);
            }

            // Update the posting's data with the new accepted and rejected applicants arrays
            await updateDoc(postingRef, { acceptedApplicants: newApplicants, rejectedApplicants: otherApplicants });
        } else {
            // **Same exact code as above, just flipped around for rejection instead of approval**
            // Get existing accepted applicants and rejected applicants to the posting
            let newApplicants = postingSnap.data().rejectedApplicants;
            let otherApplicants = postingSnap.data().acceptedApplicants;

            // If the applicant is already rejected, then remove them from the rejected array
            // and adjust the posting's data saved in the student's applied postings to match.

            // Else, add the applicant to the rejected array, and update the posting's data
            // saved in the student's applied postings to match
            if (newApplicants.includes(applicantId)) {
                newApplicants = newApplicants.filter((a) => a !== applicantId);
                applicantPostingData[0].status = '';
            } else {
                newApplicants.push(applicantId);
                applicantPostingData[0].status = 'rejected';
                studentApplicationStatus(applicantId, postingId, newStatus);
            }

            // If rejected applicants includes the applicant, remove them since
            // they can't be accepted and rejected at the same time
            if (otherApplicants.includes(applicantId)) {
                otherApplicants = otherApplicants.filter((a) => a !== applicantId);
            }

            // Update the posting's data with the new accepted and rejected applicants arrays
            await updateDoc(postingRef, { rejectedApplicants: newApplicants, acceptedApplicants: otherApplicants });
        }

        // Push the new updated applicant posting's data to the main applicant postings array
        applicantPostings.push(applicantPostingData[0]);

        // Update the applicant's doc with the new applicant postings array
        await updateDoc(applicantPostingsRef, { appliedPostings: applicantPostings });

        // Update the modal with the new posting data, so that 
        // accepted and rejected applicants are visible
        setSelectedPosting((await getDoc(postingRef)).data());
        fetchPostings(role);
    }

    async function handleShowSelectedModal() {
        await fetchPostings(role);
        setShowSelectedModal(true);
    }

    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            minWidth: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <CustomNavbar />
            <Card style={{ minWidth: '80vw', maxWidth: '80vw', marginTop: '4em', marginBottom: '2em', minHeight: '80vh' }}>
                <Card.Header style={{ width: '100%', padding: '24px' }}>
                    {location.pathname == '/postings' && <Card.Title style={{ width: '100%', marginBottom: '1em' }}><strong>Postings</strong></Card.Title>}
                    {location.pathname == '/your-postings' && <Card.Title style={{ width: '100%', marginBottom: '1em' }}><strong>Your Postings</strong></Card.Title>}
                    {location.pathname == '/your-applications' && <Card.Title style={{ width: '100%', marginBottom: '1em' }}><strong>Your Applications</strong></Card.Title>}
                    <FiltersDisplay showStatusFilters={showStatusFilters} />
                    <Form.Control
                        type="text"
                        placeholder="Search by job title or description..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{}}
                    />
                </Card.Header>
                <Card.Body style={{ display: 'flex', flexWrap: 'wrap', }}>
                    {!mobileView && (
                        <>
                            <div style={{ width: '45%', marginRight: '2%' }}>
                                {filteredLocalPostings.length == 0 && <Card.Text>No postings found!</Card.Text>}
                                {filteredLocalPostings.map((posting, index) => (
                                    <Posting
                                        key={index}
                                        postingData={posting}
                                        location={location}
                                        ref={(el) => (postingRefs.current[posting.id] = el)}
                                        onViewApplicants={(posting) => {
                                            if (selectedPosting?.id == posting.id) {
                                                setSelectedPosting(null);
                                            } else {
                                                setSelectedPosting(posting);
                                            }
                                            handleShowSelectedModal(true);
                                        }}
                                        onEditPosting={(posting) => {
                                            setEditPosting(posting);
                                            setShowEditModal(true);
                                        }}
                                    />
                                ))}
                            </div>
                            {selectedPosting &&
                                <div style={{ width: '53%' }}>
                                    <Card
                                        show={showSelectedModal || false}
                                        style={{ position: 'sticky', top: '6em', maxHeight: '85vh' }}
                                    >
                                        <Card.Header>
                                            <Card.Title>{selectedPosting.title}</Card.Title>
                                            <Card.Text style={{ marginBottom: '4px' }}>Expiration: {handleDate(selectedPosting.expirationDate)}, {selectedPosting.expirationTime} </Card.Text>
                                            {(applicantData.length > 0 && role == 'employer' && selectedPosting.uid == userData.uid) ?
                                                <div>
                                                    {applicantData.map((data, index) => (
                                                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px', marginBottom: '2px' }} key={index}>
                                                            <div>
                                                                {selectedPosting.acceptedApplicants.includes(data.uid) && "Accepted: "}
                                                                {selectedPosting.rejectedApplicants.includes(data.uid) && "Rejected: "}
                                                                <span onClick={(() => handleProfileNavigate(data.uid, selectedPosting.id))} style={{ color: "#007bff", cursor: 'pointer', textDecoration: 'underline' }}>{data.userName || data.email}</span>
                                                            </div>
                                                            <div>
                                                                <Button variant="success" style={{ marginRight: '4px' }} onClick={() => handleApplicantStatus(data.uid, selectedPosting.id, 'accepted')}>
                                                                    Accept
                                                                </Button>
                                                                <Button variant="danger" onClick={() => handleApplicantStatus(data.uid, selectedPosting.id, 'rejected')}>
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div> : (role == 'employer' && selectedPosting.uid == userData.uid) && <Card.Text>No applicants found.</Card.Text>
                                            }
                                        </Card.Header>
                                        <Card.Body>
                                            {selectedPosting.selectedTags.map((t) => (
                                                <Button variant="success" style={{ marginRight: '4px' }} disabled>{t}</Button>
                                            ))}
                                            <Card.Text><strong>Company: </strong><Link to={`/view-profile/${selectedPosting.uid}`}>{selectedPosting.companyName}</Link> <br />
                                                <strong>Location: </strong>{selectedPosting.location} <br />
                                                <strong>Address: </strong>{selectedPosting.address} </Card.Text>
                                            <div style={{ maxHeight: '45vh', overflow: 'auto' }}>
                                                <ReactQuill
                                                    value={selectedPosting.jobDescription}
                                                    readOnly
                                                    theme="snow"
                                                    modules={{ toolbar: false }}
                                                />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            }
                        </>
                    )}
                    {mobileView && (
                        <div style={{ width: '100%' }}>
                        {filteredLocalPostings.length == 0 && <Card.Text>No postings found!</Card.Text>}
                        {filteredLocalPostings.map((posting) => (
                            <Posting
                                key={posting.id}
                                postingData={posting}
                                location={location}
                                ref={(el) => (postingRefs.current[posting.id] = el)}
                                onViewApplicants={(posting) => {
                                    if (selectedPosting?.id == posting.id) {
                                        setSelectedPosting(null);
                                    } else {
                                        setSelectedPosting(posting);
                                    }
                                    handleShowSelectedModal(true);
                                }}
                                onEditPosting={(posting) => {
                                    setEditPosting(posting);
                                    setShowEditModal(true);
                                }}
                            />
                        ))}
                    </div>
                    )}
                </Card.Body>
            </Card>

            {editPosting &&
                <Modal
                    show={showEditModal || false}
                    onHide={() => setShowEditModal(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Edit posting: {editPosting.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Job Overview</Form.Label>
                                <Form.Control
                                    name="title"
                                    value={editPosting.title}
                                    type="text"
                                    placeholder="Job Title"
                                    onChange={handleChange}
                                    style={{ marginBottom: '1em' }}
                                    required
                                />
                                <Form.Control
                                    name="location"
                                    value={editPosting.location}
                                    type="text"
                                    placeholder="Location"
                                    onChange={handleChange}
                                    style={{ marginBottom: '1em' }}
                                    required
                                />
                                <Form.Control
                                    name="address"
                                    value={editPosting.address}
                                    type="text"
                                    placeholder="Address"
                                    onChange={handleChange}
                                    style={{ marginBottom: '1em' }}
                                    required
                                />
                                <Button variant="success" onClick={handleAutoFill}>Autofill</Button>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Expiration</Form.Label>
                                <Form.Control
                                    name="expirationDate"
                                    value={editPosting.expirationDate || null}
                                    type="date"
                                    onChange={handleChange}
                                    style={{ marginBottom: '1em' }}
                                    required
                                />
                                <Form.Control
                                    name="expirationTime"
                                    value={editPosting.expirationTime || null}
                                    type="time"
                                    onChange={handleChange}
                                    style={{ marginBottom: '1em' }}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Job Description</Form.Label>
                                <ReactQuill
                                    value={editPosting.jobDescription}
                                    onChange={(value) => {
                                        setEditPosting((prev) => ({
                                            ...prev,
                                            jobDescription: value,
                                        }))
                                    }}
                                    theme="snow"
                                />
                            </Form.Group>
                            <Form.Group>
                                {tags.map((tag) => (
                                    <Button
                                        key={tag}
                                        variant={editPosting.selectedTags.includes(tag) ? "success" : "secondary"}
                                        onClick={() => handleTagChange(tag)}
                                    >
                                        {tag}
                                    </Button>
                                ))}
                            </Form.Group>
                            <Button
                                type="submit"
                                disabled={draftLoading}
                                onClick={() => setFormStatus('draft')}
                                variant="success" 
                            >
                                {draftLoading ? "Saving draft..." : "Save as draft"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            }
            <Modal
                show={noPosting || false}
                onHide={() => setNoPosting(false)}
            >
                <Modal.Header>No Posting Found</Modal.Header>
                <Modal.Body>
                    No posting was found. This may be becuase it was deleted or set to a status unaccessible to you.
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Postings;
