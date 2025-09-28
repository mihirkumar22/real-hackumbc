import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import NotLoggedIn from './pages/NotLoggedIn'
import Unauthorized from './pages/Unauthorized'
import ProtectedLayout from './components/ProtectedLayout'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import Home from './pages/Home'
import Learn from './pages/Learn'
import ActivityTracker from './components/ActivityTracker';
import Lesson from './pages/Lesson';

import { useAuth } from './contexts/AuthContext';
import Social from './pages/Social';
import ForgotPassword from './pages/ForgotPassword';


export default function App() {
    const { currentUser } = useAuth();

    return (
        <BrowserRouter>
            {/* Run ActivityTracker only if user is logged in */}
            {currentUser && <ActivityTracker />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/not-logged-in" element={<NotLoggedIn />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route element={<ProtectedLayout />}>
                   <Route path="/dashboard" element={<Dashboard />} />
                   <Route path="/learn" element={<Learn />} />
                   <Route path="/lesson" element={<Lesson />} />
                   <Route path="/edit-profile" element={<EditProfile />} />
                   <Route path="/social" element={<Social />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
