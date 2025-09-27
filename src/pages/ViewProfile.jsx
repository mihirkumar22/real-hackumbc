import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CustomNavbar from '../components/CustomNavbar'
import ViewStudentProfile from '../components/viewProfiles/viewStudentProfile'
import ViewEmployerProfile from '../components/viewProfiles/ViewEmployerProfile'
import Card from 'react-bootstrap/Card'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useUserContext } from '../contexts/UserContext'

function ViewProfile() {
    const { userId } = useParams();
    const [profileType, setProfileType] = useState(null);
    const [loading, setLoading] = useState(null);
    const { userData } = useUserContext();

    useEffect(() => {
        async function fetchProfileType() {
            setLoading(true);
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfileType(docSnap.data().role);
            }
            setLoading(false);
        }

        fetchProfileType();
    }, [userId])

    const role = userData.role;

    return (
        <div>
            <CustomNavbar />
            <Card.Body>
                {loading ?
                    <Card.Text>Loading...</Card.Text>
                    : profileType == "student" ?
                        <ViewStudentProfile userId={userId} />
                        : profileType == "employer" ?
                            <ViewEmployerProfile userId={userId} />
                            :
                            <Card.Text>User not found.</Card.Text>
                }
            </Card.Body>
        </div>

    )
}

export default ViewProfile;