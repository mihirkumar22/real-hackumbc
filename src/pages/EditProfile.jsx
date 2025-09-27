import React from 'react'
import Card from 'react-bootstrap/Card'
import { useUserContext } from '../contexts/UserContext'

import CustomNavbar from '../components/CustomNavbar'
import StudentEditProfile from '../components/editProfiles/studentEditProfile'
import EmployerEditProfile from '../components/editProfiles/EmployerEditProfile'

function EditProfile() {
    const { userData } = useUserContext();

    const role = userData.role;

    return (
        <div>
            <CustomNavbar />
                <div>
                    {role === 'student' &&
                        <StudentEditProfile />
                    }
                    {role === 'employer' &&
                        <EmployerEditProfile />
                    }
                </div>
        </div>
    )
}

export default EditProfile;   