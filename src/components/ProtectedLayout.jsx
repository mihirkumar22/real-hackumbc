import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUserContext } from '../contexts/UserContext'

function ProtectedLayout() {
    const { currentUser, loading } = useAuth();
    const { userData } = useUserContext();
    const location = useLocation();

    if (loading) {
        return <div>Loading... </div>
    }

    if (!currentUser) {
        return <Navigate to="/not-logged-in" replace/>
    }

    const role = userData?.role;
    
    const roleAccess = {
        '/your-postings': ['employer'],
        '/your-applications': ['student'],
        '/bookmarked-students': ['employer']
    }
    const allowedRoles = roleAccess[location.pathname] || [];
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return <Outlet />
}

export default ProtectedLayout;