import React from 'react'
import Card from 'react-bootstrap/Card'
import { useUserContext } from '../contexts/UserContext'

import StudentDashboard from '../components/dashboards/StudentDashboard'
import EmployerDashboard from '../components/dashboards/EmployerDashboard'
import CustomNavbar from '../components/CustomNavbar'
import AdminDashboard from '../components/dashboards/AdminDasbhoard'


function Dashboard() {
    const { userData } = useUserContext();

    if (!userData) {
        return <div>Loading...</div>
    }

    const role = userData.role;

    return (
        <div>
            <CustomNavbar />
            
            {role === 'student' &&
                <StudentDashboard />
            }
            {role === 'employer' &&
                <EmployerDashboard />
            }
            {role === 'admin' &&
                <AdminDashboard />
            }
        </div>
    )
}

export default Dashboard;   