import React, { useState, useEffect } from "react"
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import ProgressBar from "react-bootstrap/ProgressBar"
import Button from "react-bootstrap/Button"
import { db, storage } from "../../firebase"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useAuth } from "../../contexts/AuthContext";

function UploadResume() {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState("");
    const { currentUser } = useAuth();

    const studentId = currentUser.uid;

    useEffect(() => {
        async function fetchResume() {
            const docRef = doc(db, 'resumes', studentId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setDownloadURL(docSnap.data().resumeURL);
            }
        }

        fetchResume();
    })

    function handleFileChange(e) {
        setFile(e.target.files[0]);
    }

    async function handleFileUpload() {
        if (!file) {
            window.alert("Please select a file first!");
            return;
        }

        // Reference to the new file location in Firebase Storage
        const storageRef = ref(storage, `resumes/${studentId}/${file.name}`);

        // Get the current resume URL from Firestore if it exists
        const docRef = doc(db, "resumes", studentId);
        const docSnap = await getDoc(docRef);

        // If a resume URL already exists, delete the previous file from Firebase Storage
        if (docSnap.exists() && docSnap.data().resumeURL) {
            const oldResumeURL = docSnap.data().resumeURL;
            const oldStorageRef = ref(storage, oldResumeURL);  // Get reference to old file
            deleteObject(oldStorageRef).catch((error) => {
                console.error("Error deleting old resume:", error);
            });
        }

        // Upload the new file
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Failed to upload: ", error);
            },
            async () => {
                try {
                    // Get the download URL for the new uploaded file
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setDownloadURL(url);

                    // Save the new resume URL in Firestore (overwrites the old one)
                    await setDoc(doc(db, "resumes", studentId), { resumeURL: url }, { merge: true });

                    window.alert("Upload successful");
                } catch (error) {
                    console.error("Error getting download URL or saving to Firestore:", error);
                }
            }
        );
    }

    return (
        <Card>
            <Card.Body style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
            }}>
                <Form>
                    <Form.Group controlId="formFile">
                        <Form.Label><u> Choose file to upload </u> </Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} accept=".pdf, .doc, .docx" />
                    </Form.Group>
                    <Button onClick={handleFileUpload} variant="success" disabled={!file} style={{marginBottom: '7px', marginTop: '7px'}}>Upload Resume</Button>
                    {uploadProgress > 0 && <ProgressBar now={uploadProgress} label={`${uploadProgress.toFixed(0)}%`} />}
                    {downloadURL && (
                        <Card.Text>
                            ✅ Resume uploaded!{" "}
                            <a href={downloadURL} target="_blank" rel="noopener noreferrer">
                                View Resume
                            </a>
                        </Card.Text>
                    )}
                </Form>
            </Card.Body>
        </Card>
    )
}

export default UploadResume;
