import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useUserContext } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { usePostingsContext } from '../../contexts/PostingsContext';
import backgroundImage from '../../components/images/tree-bg.png';
import { useNavigate } from 'react-router-dom';

function EmployerDashboard() {
    const { userData } = useUserContext();
    const { currentUser } = useAuth();
    const { createPosting, tags } = usePostingsContext();
    const [loading, setLoading] = useState(false);
    const [draftLoading, setDraftLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formStatus, setFormStatus] = useState(null);
    const [postingData, setPostingData] = useState({
        uid: currentUser.uid,
        title: "",
        companyName: "",
        location: "",
        address: "",
        jobDescription: "",
        selectedTags: [],
        expirationDate: "",
        expirationTime: "23:59",
    })
    const [mobileView, setMobileView] = useState(false);
    const navigate = useNavigate();

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

    function handleClose() {
        setPostingData({
            uid: currentUser.uid,
            title: "",
            companyName: "",
            location: "",
            address: "",
            jobDescription: "",
            selectedTags: [],
            expirationDate: "",
            expirationTime: "23:59",
        })
        setShowModal(false)
    }

    function handleShow() {
        if (userData.companyName == "" || userData.companyName == null) {
            window.alert("Please go to the profile page and enter a company name to make a posting");
            return;
        }
        setShowModal(true);
    }

    async function handleAutoFill() {
        setPostingData((prev) => ({
            ...prev,
            companyName: userData.companyName || '',
            location: userData.location || '',
            address: userData.address || '',
        }));
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setPostingData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const newPostingData = {
            ...postingData,
            datePublished: new Date().toISOString(),
            applicants: [],
            acceptedApplicants: [],
            rejectedApplicants: [],
        };

        if (formStatus === 'submit') {
            newPostingData.status = 'pending';
            setLoading(true);
        } else {
            newPostingData.status = 'draft';
            setDraftLoading(true);
        }

        if (postingData.expirationTime == "" || null) {
            postingData.expirationTime = "23:59";
        }

        try {
            await createPosting(newPostingData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setDraftLoading(false);
            handleClose();
        }
    }

    function handleTagChange(tag) {
        const prevSelectedTags = postingData.selectedTags;
        setPostingData((prev) => {
            if (prevSelectedTags.includes(tag)) {
                return { ...prev, selectedTags: prevSelectedTags.filter((t) => t !== tag) };
            } else {
                return { ...prev, selectedTags: [...prevSelectedTags, tag] };
            }
        });
    }

    return (
        <div
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
            }}
        >
            <Card
                style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '2rem',
                }}
            >
                <Card.Body>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif, Nunito',
                        textTransform: 'uppercase'
                    }}>
                        <i>Welcome,</i>
                    </div>
                    {!mobileView && 
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            marginTop: '0.0rem'
                        }}>
                            {userData.companyName ? userData.companyName : userData.email}
                        </div>
                    }
                    {mobileView && 
                           <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginTop: '0.0rem'
                        }}>
                            {userData.companyName ? userData.companyName : userData.email}hi
                        </div>         
                    }
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button style={{ minWidth: '200px', width: '35vh', height: '5vh', marginTop: '3vh' }} variant="success" onClick={handleShow}>+ Make a new posting</Button>
                        <Button style={{ minWidth: '200px', width: '35vh', height: '5vh', marginTop: '3vh' }} variant="success" onClick={() => { navigate('/your-postings') }}>View your postings</Button>
                        <Button style={{ minWidth: '200px', width: '35vh', height: '5vh', marginTop: '3vh' }} variant="success" onClick={() => { navigate('/bookmarked-students') }}>View bookmarked students</Button>
                    </div>
                </Card.Body>
            </Card>


            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Make a new posting</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Job Overview</Form.Label>
                            <Form.Control
                                name="title"
                                value={postingData.title}
                                type="text"
                                placeholder="Job Title"
                                onChange={handleChange}
                                style={{ marginBottom: '1em' }}
                                required
                            />
                            <Form.Control
                                name="location"
                                value={postingData.location}
                                type="text"
                                placeholder="Location"
                                onChange={handleChange}
                                style={{ marginBottom: '1em' }}
                                required
                            />
                            <Form.Control
                                name="address"
                                value={postingData.address}
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
                                value={postingData.expirationDate || ""}
                                type="date"
                                onChange={handleChange}
                                style={{ marginBottom: '1em' }}
                                required
                            />
                            <Form.Control
                                name="expirationTime"
                                value={postingData.expirationTime || ""}
                                type="time"
                                onChange={handleChange}
                                style={{ marginBottom: '1em' }}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Job Description</Form.Label>
                            <ReactQuill
                                theme="snow"
                                value={postingData.jobDescription}
                                placeholder="Enter a detailed job description"
                                onChange={(value) => {
                                    setPostingData((prev) => ({
                                        ...prev,
                                        jobDescription: value,
                                    }));
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Set tags</Form.Label>
                            {tags.map((tag) => (
                                <Button
                                    key={tag}
                                    type="button"
                                    variant={postingData.selectedTags.includes(tag) ? "success" : "secondary"}
                                    onClick={() => handleTagChange(tag)}
                                >
                                    {tag}
                                </Button>
                            ))}
                        </Form.Group>
                        <Button
                            type="submit"
                            disabled={loading}
                            onClick={() => setFormStatus('submit')}
                            style={{ marginRight: '1rem' }}
                            variant="success" 
                        >
                            {loading ? "Submitting..." : "Submit for Approval"}
                        </Button>
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
        </div >
    );
}

export default EmployerDashboard;
